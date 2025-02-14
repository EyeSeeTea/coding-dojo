import { Future } from "../../domain/entities/generic/Future";
import { TimeTracking } from "../../domain/entities/TimeTracking";
import {
    TimeTrackingFilters,
    TimeTrackingRepository,
} from "../../domain/repositories/TimeTrackingRepository";
import { D2Api, D2TrackerEvent } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import {
    getValueByDataElementIdFromDataValues,
    MANAGERS_TIME_TRACKING_PROGRAM_ID,
    TIME_TRACKING_DESCRIPTION_DATA_ELEMENT_ID,
    TIME_TRACKING_HOURS_DATA_ELEMENT_ID,
    TIME_TRACKING_PROGRAM_STAGE_ID,
} from "./common/constants";

export class TimeTrackingD2Repository implements TimeTrackingRepository {
    constructor(private api: D2Api) {}

    get(filters?: TimeTrackingFilters): FutureData<TimeTracking[]> {
        const { managerId, timeTrackingIds } = filters || {};
        return apiToFuture(
            this.api.tracker.events.get({
                program: MANAGERS_TIME_TRACKING_PROGRAM_ID,
                programStage: TIME_TRACKING_PROGRAM_STAGE_ID,
                fields: trackerEventFields,
                trackedEntity: managerId,
                event: timeTrackingIds?.join(","), // comma-delimited list of uid
                // skipPaging: true,
            })
        ).flatMap(response => {
            const trackerEvents: D2TrackerEvent[] = response.instances;
            const timeTrackings = trackerEvents.map(trackerEvent =>
                this.mapTrackedEntityEventToTimeTracking(trackerEvent)
            );
            return Future.success(timeTrackings);
        });
    }

    save(timeTrackings: TimeTracking[]): FutureData<void> {
        const trackerEvents: D2TrackerEvent[] = timeTrackings.map(timeTracking =>
            this.mapTimeTrackingToTrackedEntityEvent(timeTracking)
        );

        // Get tracker entity to get OrgUnitId, do not contaminate the domain entity TimeTracking with orgUnitId
        return apiToFuture(
            this.api.tracker.post(
                { importStrategy: "CREATE_AND_UPDATE" },
                { events: trackerEvents }
            )
        ).map(() => undefined);
    }

    private mapTrackedEntityEventToTimeTracking(trackerEvent: D2TrackerEvent): TimeTracking {
        const stringHours = getValueByDataElementIdFromDataValues(
            trackerEvent.dataValues,
            TIME_TRACKING_HOURS_DATA_ELEMENT_ID
        );
        const description = getValueByDataElementIdFromDataValues(
            trackerEvent.dataValues,
            TIME_TRACKING_DESCRIPTION_DATA_ELEMENT_ID
        );

        const approved = trackerEvent.status === "COMPLETED";

        // QUESTION: how to throw an error if any of these fields are missing? --> change to use Futures and Future.error
        if (!stringHours || !description || !trackerEvent.trackedEntity) {
            throw new Error("Invalid TimeTracking data");
        }

        // TODO: Validate hours should be non negative
        return TimeTracking.create({
            id: trackerEvent.event,
            managerId: trackerEvent.trackedEntity,
            orgUnitId: trackerEvent.orgUnit,
            day: new Date(trackerEvent.occurredAt),
            approved: approved,
            hours: parseFloat(stringHours),
            description,
        });
    }

    private mapTimeTrackingToTrackedEntityEvent(timeTracking: TimeTracking): D2TrackerEvent {
        return {
            program: MANAGERS_TIME_TRACKING_PROGRAM_ID,
            programStage: TIME_TRACKING_PROGRAM_STAGE_ID,
            orgUnit: timeTracking.orgUnitId,
            trackedEntity: timeTracking.managerId,
            dataValues: [
                {
                    dataElement: TIME_TRACKING_HOURS_DATA_ELEMENT_ID,
                    value: timeTracking.hours.toString(),
                },
                {
                    dataElement: TIME_TRACKING_DESCRIPTION_DATA_ELEMENT_ID,
                    value: timeTracking.description,
                },
            ],
            event: timeTracking.id,
            occurredAt: timeTracking.day.toISOString(),
            status: timeTracking.approved ? "COMPLETED" : "ACTIVE",
        };
    }
}

const trackerEventFields = {
    trackedEntity: true,
    program: true,
    orgUnit: true,
    dataValues: {
        dataElement: { id: true, code: true },
        value: true,
    },
    event: true,
    occurredAt: true,
    status: true,
} as const;
