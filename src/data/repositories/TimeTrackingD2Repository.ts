import { D2Api } from "@eyeseetea/d2-api/2.36";
import { Id } from "../../domain/entities/Ref";
import {
    ApprovalStatuses,
    approvalStatuses,
    TimeTrackingBaseAttrs,
} from "../../domain/entities/TimeTracking";
import { TimeTrackingRepository } from "../../domain/repositories/TimeTrackingRepository";
import { apiToFuture, FutureData } from "../api-futures";

import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";
import { Future } from "../../domain/entities/generic/Future";

const GLOBAL_ORG_UNIT_ID = "GLOBAL_ORG_UNIT_ID";
const D2_TIME_TRACKING_PROGRAM_ID = "D2_TIME_TRACKING_PROGRAM_ID";
const TimeTrackingDataElementsMap = {
    name: "D2_TIME_TRACKING_DATA_ELEMENT_NAME",
    date: "D2_TIME_TRACKING_DATA_ELEMENT_DATE",
    hours: "D2_TIME_TRACKING_DATA_ELEMENT_HOURS",
    description: "D2_TIME_TRACKING_DATA_ELEMENT_DESCRIPTION",
    approvalStatus: "D2_TIME_TRACKING_DATA_ELEMENT_APPROVAL_STATUS",
    managerId: "D2_TIME_TRACKING_DATA_ELEMENT_MANAGER",
};

export class TimeTrackingD2Repository implements TimeTrackingRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<TimeTrackingBaseAttrs[]> {
        return apiToFuture(
            this.api.tracker.events
                .get({
                    fields: { event: true, dataValues: true },
                    program: D2_TIME_TRACKING_PROGRAM_ID,
                })
                .map(response => {
                    return response.data.instances.map(responseObject => {
                        return this.mapD2EventToTimeTracking(responseObject);
                    });
                })
        );
    }
    getByManager(managerId: Id): FutureData<TimeTrackingBaseAttrs[]> {
        return apiToFuture(
            this.api.tracker.events
                .get({
                    fields: { event: true, dataValues: true },
                    program: D2_TIME_TRACKING_PROGRAM_ID,
                    filter: `${TimeTrackingDataElementsMap.managerId}:eq:${managerId}`,
                })
                .map(response => {
                    return response.data.instances.map(responseObject => {
                        return this.mapD2EventToTimeTracking(responseObject);
                    });
                })
        );
    }
    getById(id: Id): FutureData<TimeTrackingBaseAttrs> {
        return apiToFuture(
            this.api.tracker.events
                .getById(id, {
                    fields: { event: true, dataValues: true },
                })
                .map(response => {
                    return this.mapD2EventToTimeTracking(response.data);
                })
        );
    }
    updateStatus(id: Id, status: ApprovalStatuses): FutureData<void> {
        const timeTrackerToUpdate: D2TrackerEvent = {
            event: id,
            dataValues: [
                {
                    dataElement: TimeTrackingDataElementsMap.approvalStatus,
                    value: status,
                },
            ],
            status: "ACTIVE",
            orgUnit: GLOBAL_ORG_UNIT_ID,
            program: D2_TIME_TRACKING_PROGRAM_ID,
            occurredAt: new Date().toISOString(),
        };

        return apiToFuture(
            this.api.tracker.post({ importStrategy: "UPDATE" }, { events: [timeTrackerToUpdate] })
        ).flatMap(response => {
            if (response.status === "ERROR")
                return Future.error(new Error("Error mapping disease outbreak event id to alert"));
            else return Future.success(undefined);
        });
    }

    private mapD2EventToTimeTracking(event: D2TrackerEvent): TimeTrackingBaseAttrs {
        const name =
            event.dataValues?.find(
                dataValue => dataValue.dataElement === TimeTrackingDataElementsMap.name
            )?.value ?? "Unnamed";

        const dateStr = event.dataValues?.find(
            dataValue => dataValue.dataElement === TimeTrackingDataElementsMap.date
        )?.value;
        if (!dateStr) throw new Error("Mandatory date not found");

        const date = isNaN(new Date(dateStr).getTime()) ? new Date() : new Date(dateStr);

        const hours = event.dataValues?.find(
            dataValue => dataValue.dataElement === TimeTrackingDataElementsMap.hours
        )?.value;

        const hoursNumber = hours ? (Number.isNaN(parseFloat(hours)) ? 0 : parseFloat(hours)) : 0;

        const approvalStatusDataValue = event.dataValues?.find(
            dataValue => dataValue.dataElement === TimeTrackingDataElementsMap.approvalStatus
        )?.value;
        const approvalStatus =
            approvalStatuses.find(status => status === approvalStatusDataValue) ?? "PENDING"; //Pending by default

        const description = event.dataValues?.find(
            dataValue => dataValue.dataElement === TimeTrackingDataElementsMap.description
        )?.value;

        const managerId = event.dataValues?.find(
            dataValue => dataValue.dataElement === TimeTrackingDataElementsMap.managerId
        )?.value;

        if (!managerId) throw new Error("Mandatory manager Id not found");
        return {
            id: event.event,
            name: name,
            date: date,
            hours: hoursNumber,
            approvalStatus: approvalStatus,
            description: description,
            managerId: managerId,
        };
    }
}
