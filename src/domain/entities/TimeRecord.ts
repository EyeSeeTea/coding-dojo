import { Struct } from "./generic/Struct";
import { Id } from "./Ref";

export const approvedStatus = "APPROVED";
export const rejectedStatus = "REJECTED";
export const pendingStatus = "PENDING";
const timeRecordStatuses = [approvedStatus, rejectedStatus, pendingStatus] as const;

export type TimeRecordStatus = (typeof timeRecordStatuses)[number];

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
    static approve(records: TimeRecord[]): TimeRecord[] {
        return records.filter(r => r.isPending()).map(t => t.approve());
    }
}
