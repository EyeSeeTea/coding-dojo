import { D2Api } from "../../types/d2-api";
import { TimeTracking, timeTrackingStatus } from "../../domain/entities/TimeTracking";
import {
    GetTimeTrackingOptions,
    Paginated,
    TimeTrackingRepository,
} from "../../domain/repositories/TimeTrackingRepository";
import { FutureData, apiToFuture } from "../api-futures";
import { Metadata, getBaseMetadata } from "../metadata";
import { Maybe } from "../../utils/ts-utils";
import { Future } from "../../domain/entities/generic/Future";
import { generateUid } from "../../utils/uid";
import { D2TrackerEventToPost } from "@eyeseetea/d2-api/api/trackerEvents";

export class TimeTrackingD2Repository implements TimeTrackingRepository {
    constructor(private api: D2Api) {}

    get(options: GetTimeTrackingOptions): FutureData<Paginated<TimeTracking>> {
        return this.getMetadata().flatMap(metadata => {
            return this.getEvents(options, metadata).map(response => {
                const timeTrackings = response.instances.map(instance => {
                    return this.buildTimeTrackings(metadata, instance);
                });
                return {
                    data: timeTrackings,
                    page: response.page,
                    pageSize: response.pageSize,
                    total: response.total ?? 0,
                };
            });
        });
    }

    getById(id: string): FutureData<TimeTracking> {
        const options: GetTimeTrackingOptions = {
            timeTrackingId: id,
            page: 1,
            pageSize: 1,
        };

        return this.getMetadata().flatMap(metadata => {
            return this.getEvents(options, metadata).flatMap(response => {
                const timeTrackings = response.instances.map(instance => {
                    return this.buildTimeTrackings(metadata, instance);
                });
                const firstTimeTracking = timeTrackings[0];
                if (!firstTimeTracking) return Future.error(new Error("Time tracking not found"));
                return Future.success(firstTimeTracking);
            });
        });
    }

    save(timeTracking: TimeTracking): FutureData<void> {
        return this.getMetadata().flatMap(metadata => {
            return apiToFuture(
                this.api.tracker.events.get({
                    fields: { $all: true },
                    event: timeTracking.id,
                    skipPaging: true,
                })
            ).flatMap(d2Response => {
                const firstEvent = d2Response.instances[0];
                const currentDate = new Date().toISOString();
                const ocurredAt = firstEvent?.occurredAt ?? currentDate;
                const eventToSave: D2TrackerEventToPost = {
                    ...(firstEvent || {}),
                    trackedEntity: timeTracking.managerId,
                    event: timeTracking.id,
                    program: metadata.program.timeTracking.id,
                    programStage: metadata.programStage.timeTrackingStage.id,
                    enrollment: firstEvent?.enrollment ?? generateUid(),
                    orgUnit: "",
                    occurredAt: ocurredAt,
                    dataValues: [
                        {
                            dataElement: metadata.dataElements.timeTrackingDate.id,
                            value: timeTracking.date,
                        },
                        {
                            dataElement: metadata.dataElements.timeTrackingHours.id,
                            value: timeTracking.hours.toString(),
                        },
                        {
                            dataElement: metadata.dataElements.timeTrackingStatus.id,
                            value: timeTracking.status,
                        },
                    ],
                };

                return apiToFuture(this.api.tracker.post({}, { events: [eventToSave] })).flatMap(
                    postResponse => {
                        return postResponse.status !== "OK"
                            ? Future.error(new Error(`Error: ${postResponse.message}`))
                            : Future.success(undefined);
                    }
                );
            });
        });
    }

    private buildTimeTrackings(metadata: Metadata, event: D2EventRecord) {
        const date = this.getValue(event.dataValues, metadata.dataElements.timeTrackingDate.id);
        const hours = Number(
            this.getValue(event.dataValues, metadata.dataElements.timeTrackingHours.id)
        );
        const d2Status = this.getValue(
            event.dataValues,
            metadata.dataElements.timeTrackingStatus.id
        );

        const currentStatus = timeTrackingStatus.find(status => status === d2Status);

        return TimeTracking.create({
            id: event.event,
            date,
            hours,
            status: currentStatus ?? "pending",
            managerId: event.trackedEntity ?? "",
        }).get();
    }

    private getValue(dataValues: D2DataValueEvent[], dataElementId: string) {
        return dataValues.find(dataValue => dataValue.dataElement === dataElementId)?.value ?? "";
    }

    private getEvents(options: GetTimeTrackingOptions, metadata: Metadata) {
        return apiToFuture(
            this.api.tracker.events.get({
                fields: {
                    event: true,
                    dataValues: true,
                    trackedEntity: true,
                },
                event: options.timeTrackingId,
                program: metadata.program.timeTracking.id,
                programStage: metadata.programStage.timeTrackingStage.id,
                page: options.page,
                pageSize: options.pageSize,
                trackedEntity: options.managerId,
                totalPages: true,
            })
        );
    }

    private getMetadata() {
        return getBaseMetadata(this.api);
    }
}

type D2DataValueEvent = {
    dataElement: string;
    value: string;
};

type D2EventRecord = {
    event: string;
    trackedEntity: Maybe<string>;
    dataValues: D2DataValueEvent[];
};
