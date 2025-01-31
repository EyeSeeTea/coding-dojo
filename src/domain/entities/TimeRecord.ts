import { Struct } from "./generic/Struct";
import { Id } from "./Ref";
import { FutureData } from "../../data/api-futures";

export const approvedStatus = "APPROVED";
export const rejectedStatus = "REJECTED";
export const pendingStatus = "PENDING";

export type TimeRecordStatus = typeof approvedStatus | typeof rejectedStatus | typeof pendingStatus;

export interface TimeRecordAttrs {
    id: Id;
    description: string;
    status: TimeRecordStatus;
    date: Date;
    hours: number;
    managerId: Id;

    dateCreated: Date;
    dateStatusUpdate?: Date;
    notes: string;
}

export class TimeRecord extends Struct<TimeRecordAttrs>() {
    isApproved() {
        return this.status === approvedStatus;
    }
    isPending() {
        return this.status === pendingStatus;
    }
    approve() {
        return this.updateStatus(approvedStatus);
    }
    updateStatus(status: TimeRecordStatus, notes?: string) {
        return this._update({
            status,
            notes,
            dateStatusUpdate: new Date(),
        });
    }
}

export type GetTimeRecordOptions = {
    managerId?: Id;
    Ids?: Id[];
    startDate?: Date;
    endDate?: Date;
    status?: TimeRecordStatus;
};

export interface TimeRecordRepository {
    get(options: GetTimeRecordOptions): FutureData<TimeRecord[]>;
    getById(timeRecordId: Id): FutureData<TimeRecord[]>;
    save(timeRecord: TimeRecord): FutureData<TimeRecord>;
}
