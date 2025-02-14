import { TimeEntry, TimeEntryApprovalStatus } from "../../domain/entities/TimeEntry";
import {
    GetTimeEntriesFilters,
    TimeEntryRepository,
} from "../../domain/repositories/TimeEntryRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { D2Api } from "../../types/d2-api";
import { Day } from "../../domain/entities/Day";

const metadataConfig = {
    program: "id",
    programStage: "id",
    orgUnit: "rootId",
    dataElements: {
        hours: "id",
        day: "id",
        description: "id",
        approvalStatus: "id",
        approverId: "id",
    },
};

const fields = {
    event: true,
    trackedEntity: true,
    dataValues: { dataElement: true, value: true },
} as const;

export class TimeEntryD2Repository implements TimeEntryRepository {
    constructor(private api: D2Api) {}

    get(filters?: GetTimeEntriesFilters): FutureData<TimeEntry[]> {
        return apiToFuture(
            this.api.tracker.events.get({
                orgUnit: metadataConfig.orgUnit,
                program: metadataConfig.program,
                programStage: metadataConfig.programStage,
                fields,
                filter: buildFilter(filters),
                ouMode: "DESCENDANTS",
                ...(filters?.managerId ? { trackedEntity: filters.managerId } : {}),
            })
        ).map(response => response.instances.map(mapEventToTimeEntry));
    }

    update(timeEntry: TimeEntry): FutureData<void> {
        return apiToFuture(
            this.api.tracker.post(
                {
                    importStrategy: "UPDATE",
                },
                {
                    events: [
                        {
                            event: timeEntry.id,
                            orgUnit: metadataConfig.orgUnit,
                            program: metadataConfig.program,
                            programStage: metadataConfig.programStage,
                            trackedEntity: timeEntry.managerId,
                            dataValues: toDataValues(timeEntry),
                            occurredAt: new Date().toISOString(),
                            status: "COMPLETED", // ?
                        },
                    ],
                }
            )
        ).map(() => undefined);
    }
}

function buildFilter(filters: GetTimeEntriesFilters = {}): string {
    return [
        filters.from ? `${metadataConfig.dataElements.day}:ge:${filters.from}` : null,
        filters.to ? `${metadataConfig.dataElements.day}:le:${filters.to}` : null,
        filters.status
            ? `${metadataConfig.dataElements.approvalStatus}:eq:${filters.status}`
            : null,
    ]
        .filter(f => f !== null)
        .join("&"); // TODO: How to concat multiple filters?
}

type DataValue = { dataElement: string; value: string };

function toDataValues(timeEntry: TimeEntry): DataValue[] {
    return [
        { dataElement: metadataConfig.dataElements.hours, value: timeEntry.hours.toString() },
        { dataElement: metadataConfig.dataElements.day, value: timeEntry.day.toString() },
        { dataElement: metadataConfig.dataElements.description, value: timeEntry.description },
        {
            dataElement: metadataConfig.dataElements.approvalStatus,
            value: timeEntry.approvalStatus,
        },
        ...(timeEntry.approverId
            ? [{ dataElement: metadataConfig.dataElements.approverId, value: timeEntry.approverId }]
            : []),
    ];
}

function getDataValue(id: string, values: DataValue[]): string | undefined {
    return values.find(v => v.dataElement === id)?.value;
}

function getRequiredDataValue(id: string, values: DataValue[]): string {
    const value = getDataValue(id, values);
    if (!value) {
        throw new Error(`Missing value for data element ${id}`);
    }
    return value;
}

// TODO: Should use MetadataPick? How to use for tracker events?
// type D2Event = MetadataPick<{ events: { fields: typeof fields} }>["events"][number];

type D2Event = {
    event: string;
    trackedEntity?: string;
    dataValues: DataValue[];
};

function mapEventToTimeEntry(event: D2Event): TimeEntry {
    const dayString = getRequiredDataValue(metadataConfig.dataElements.day, event.dataValues);
    if (!event.trackedEntity) {
        throw new Error(`Missing manager for event ${event.event}`);
    }
    return new TimeEntry({
        id: event.event,
        approvalStatus: getRequiredDataValue(
            metadataConfig.dataElements.approvalStatus,
            event.dataValues
        ) as TimeEntryApprovalStatus,
        approverId: getDataValue(metadataConfig.dataElements.approverId, event.dataValues) ?? null,
        day: Day.fromString(dayString),
        description: getRequiredDataValue(
            metadataConfig.dataElements.description,
            event.dataValues
        ),
        hours: Number(getRequiredDataValue(metadataConfig.dataElements.hours, event.dataValues)),
        managerId: event.trackedEntity,
    });
}
