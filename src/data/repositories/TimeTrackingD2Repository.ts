import { D2Api } from "@eyeseetea/d2-api/2.36";
import { TimeTrackingRepository } from "../../domain/repositories/TimeTrackingRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { TimeTracking } from "../../domain/entities/TimeTracking";
import {
    MANAGER_TRACKER_PROGRAM_ID,
    TIME_TRACKING_ORG_UNIT_ID,
} from "../consts/TimeTrackingConstants";
import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";
import { Future } from "../../domain/entities/generic/Future";
import { Maybe } from "../../utils/ts-utils";

type ApprovalStatus = "APPROVED" | "REJECTED";

export class TimeTrackingD2Repository implements TimeTrackingRepository {
    constructor(private api: D2Api) {}

    listByManager(managerId: string): FutureData<TimeTracking[]> {
        return apiToFuture(
            this.api.tracker.events.get({
                program: MANAGER_TRACKER_PROGRAM_ID,
                orgUnit: TIME_TRACKING_ORG_UNIT_ID,
                trackedEntity: managerId,
                fields: { event: true, dataValues: true, trackedEntity: true },
            })
        ).flatMap(d2TimeTrackingsResponse => {
            const timeTrackingEvents = d2TimeTrackingsResponse.instances;

            return Future.parallel(
                timeTrackingEvents.map(timeTrackingEvent =>
                    this.buildTimeTrackingFromEvent(timeTrackingEvent, managerId)
                ),
                { concurrency: 5 }
            );
        });
    }

    getById(id: string): FutureData<Maybe<TimeTracking>> {
        return apiToFuture(
            this.api.tracker.events.get({
                program: MANAGER_TRACKER_PROGRAM_ID,
                orgUnit: TIME_TRACKING_ORG_UNIT_ID,
                event: id,
                fields: { event: true, dataValues: true, trackedEntity: true },
            })
        ).flatMap(d2TimeTrackingResponse => {
            const timeTrackingEvent = d2TimeTrackingResponse.instances[0];

            if (!timeTrackingEvent || !timeTrackingEvent.trackedEntity)
                return Future.error(new Error("Time tracking entry not found."));

            return this.buildTimeTrackingFromEvent(
                timeTrackingEvent,
                timeTrackingEvent.trackedEntity
            );
        });
    }

    save(timeTracking: TimeTracking): FutureData<void> {
        return apiToFuture(
            this.api.tracker.post(
                { importStrategy: "CREATE_AND_UPDATE" },
                {
                    events: [this.buildEventFromTimeTracking(timeTracking)],
                }
            )
        ).flatMap(response => {
            if (response.status === "ERROR")
                return Future.error(new Error("Failed to save time tracking entry."));
            return Future.success(undefined);
        });
    }

    private buildTimeTrackingFromEvent(
        timeTrackingEvent: D2TrackerEvent,
        managerId: string
    ): FutureData<TimeTracking> {
        const { event, dataValues } = timeTrackingEvent;

        const day = getEventDataValue(dataValues, TIME_TRACKING_DAY_DATA_VALUE_ID);
        const month = dataValues.find(
            dataValue => dataValue.dataElement === TIME_TRACKING_MONTH_DATA_VALUE_ID
        )?.value;
        const year = dataValues.find(
            dataValue => dataValue.dataElement === TIME_TRACKING_YEAR_DATA_VALUE_ID
        )?.value;
        const description = dataValues.find(
            dataValue => dataValue.dataElement === TIME_TRACKING_DESCRIPTION_DATA_VALUE_ID
        )?.value;
        const approvalStatus = dataValues.find(
            dataValue => dataValue.dataElement === TIME_TRACKING_APPROVAL_STATUS_DATA_VALUE_ID
        )?.value as ApprovalStatus;

        if (!day || !month || !year || !description || approvalStatus === undefined)
            return Future.error(new Error("Time tracking data is incomplete."));

        return Future.success(
            new TimeTracking({
                id: event,
                managerId: managerId,
                date: {
                    day: parseInt(day),
                    month: parseInt(month),
                    year: parseInt(year),
                },
                description: description,
                approved: approvalStatus === "APPROVED",
            })
        );
    }

    private buildEventFromTimeTracking(timeTracking: TimeTracking): D2TrackerEvent {
        const event: D2TrackerEvent = {
            program: MANAGER_TRACKER_PROGRAM_ID,
            orgUnit: TIME_TRACKING_ORG_UNIT_ID,
            event: timeTracking.id,
            dataValues: [
                {
                    dataElement: TIME_TRACKING_DAY_DATA_VALUE_ID,
                    value: timeTracking.date.day.toString(),
                },
                {
                    dataElement: TIME_TRACKING_MONTH_DATA_VALUE_ID,
                    value: timeTracking.date.month.toString(),
                },
                {
                    dataElement: TIME_TRACKING_YEAR_DATA_VALUE_ID,
                    value: timeTracking.date.year.toString(),
                },
                {
                    dataElement: TIME_TRACKING_DESCRIPTION_DATA_VALUE_ID,
                    value: timeTracking.description,
                },
                {
                    dataElement: TIME_TRACKING_APPROVAL_STATUS_DATA_VALUE_ID,
                    value: timeTracking.approved ? "APPROVED" : "REJECTED",
                },
            ],
            status: "ACTIVE",
            occurredAt: new Date().toISOString(),
        };

        return event;
    }
}

const TIME_TRACKING_DAY_DATA_VALUE_ID = "TIME_TRACKING_DAY_DATA_VALUE_ID";
const TIME_TRACKING_MONTH_DATA_VALUE_ID = "TIME_TRACKING_MONTH_DATA_VALUE_ID";
const TIME_TRACKING_YEAR_DATA_VALUE_ID = "TIME_TRACKING_YEAR_DATA_VALUE_ID";
const TIME_TRACKING_DESCRIPTION_DATA_VALUE_ID = "TIME_TRACKING_DESCRIPTION_DATA_VALUE_ID";
const TIME_TRACKING_APPROVAL_STATUS_DATA_VALUE_ID = "TIME_TRACKING_APPROVAL_STATUS_DATA_VALUE_ID";

function getEventDataValue(
    dataValues: D2TrackerEvent["dataValues"],
    dataValueId: string
): Maybe<string> {
    return dataValues.find(dataValue => dataValue.dataElement === dataValueId)?.value;
}
