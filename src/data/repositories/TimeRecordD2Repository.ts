import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { arrayToObject, Maybe } from "../../utils/ts-utils";
import {
    GetTimeRecordOptions,
    TimeRecordRepository,
} from "../../domain/repositories/TimeRecordRepository";
import { D2TrackerEvent } from "@eyeseetea/d2-api/api/trackerEvents";
import { pendingStatus, TimeRecord, TimeRecordStatus } from "../../domain/entities/TimeRecord";
import { timeTrackerProgram } from "./ManagerD2Repository";
import { Future } from "../../domain/entities/generic/Future";

const timeRecordProgramStage = "Fr1mYNGXaut";
const globalOrgUnit = "Jv7U6UEVeEW";

const hours = "iGE2jVItFtA";
const description = "w75KJ2mc4zz";
const status = "q8b1jz5DxPT";
const date = "Z6sE7VPot7u";
const dateStatusUpdate = "bGxoWh15whX";
const notes = "vbsvH6qzTL9";

function buildEventFilter(options: GetTimeRecordOptions): string {
    const startDateFilter = options.startDate
        ? `${date}:ge:${options.startDate.toISOString()},`
        : "";
    const endDateFilter = options.endDate ? `${date}:le:${options.endDate.toISOString()},` : "";
    const statusFilter = options.status ? `${status}:eq:${options.status},` : "";
    return `${startDateFilter}${endDateFilter}${statusFilter}`;
}

function buildEventFromTimeRecord(trackerRecord: TimeRecord): Array<{
    dataElement: string;
    value: string | number | boolean;
}> {
    const dataValuesMap: Record<string, string | undefined> = {
        [hours]: String(trackerRecord.hours),
        [description]: trackerRecord.description,
        [status]: String(trackerRecord.status),
        [date]: trackerRecord.date.toISOString(),
        [dateStatusUpdate]: trackerRecord.dateStatusUpdate?.toISOString(),
        [notes]: trackerRecord.notes,
    };

    const filteredDataValuesMap = Object.fromEntries(
        Object.entries(dataValuesMap).filter(([_, value]) => value)
    );

    return Object.entries(filteredDataValuesMap).map(([dataElement, value]) => ({
        dataElement,
        value: value ?? "",
    }));
}

export class TimeRecordD2Repository implements TimeRecordRepository {
    constructor(private api: D2Api) {}

    get(options: GetTimeRecordOptions): FutureData<TimeRecord[]> {
        return apiToFuture(
            this.api.tracker.events.get({
                event: options.Ids?.join(";"),
                trackedEntity: options.managerId,
                fields: eventTimeRecordFields,
                filter: buildEventFilter(options),
                programStage: timeRecordProgramStage,
                pageSize: 100,
            })
        ).map(response => {
            return response.instances.map(mapEventToTimeRecord);
        });
    }
    getById(Id: string): FutureData<TimeRecord> {
        return apiToFuture(
            this.api.tracker.events.get({
                event: Id,
                fields: eventTimeRecordFields,
                programStage: timeRecordProgramStage,
                pageSize: 1,
            })
        ).map(response => {
            const instance = response.instances?.[0];
            return mapEventToTimeRecord(instance || ({} as D2TrackerEvent));
        });
    }
    save(timeRecord: TimeRecord): FutureData<TimeRecord> {
        return apiToFuture(
            this.api.events.post(
                { strategy: "UPDATE" },
                {
                    events: [
                        {
                            event: timeRecord.id,
                            orgUnit: globalOrgUnit,
                            program: timeTrackerProgram,
                            status: "ACTIVE",
                            dataValues: buildEventFromTimeRecord(timeRecord),
                            eventDate: new Date().toISOString(),
                        },
                    ],
                }
            )
        ).flatMap(response => {
            if (response.status === "OK") return Future.success(timeRecord);
            else return Future.error(new Error("Failed to save time record"));
        });
    }
}

const eventTimeRecordFields = {
    event: true,
    trackedEntity: true,
    createdAt: true,
    dataValues: {
        dataElement: true,
        value: true,
    },
} as const;

function mapEventToTimeRecord(event: D2TrackerEvent): TimeRecord {
    const attributes = event.dataValues ? arrayToObject(event.dataValues, "dataElement") : {};
    return {
        id: event.trackedEntity || "No id",
        description: attributes?.[description]?.value || "No description",
        status: (attributes?.[status]?.value as TimeRecordStatus) || pendingStatus,
        date: new Date(attributes?.[date]?.value || "No date"),
        hours: attributes?.[hours]?.value ? Number(attributes?.[hours]?.value) : 0,
        managerId: event.trackedEntity || "No manager id",
        dateCreated: stringToDate(event.createdAt),
        dateStatusUpdate: stringToDate(attributes?.[dateStatusUpdate]?.value),
        notes: attributes?.[notes]?.value || "No notes",
    } as TimeRecord;
}

function stringToDate(date: Maybe<string>): Date {
    return date ? new Date(date) : new Date();
}
