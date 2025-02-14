import { Day } from "./Day";
import { Struct } from "./generic/Struct";
import { Id, Ref } from "./Ref";

export enum TimeEntryApprovalStatus {
    Approved = "approved",
    Rejected = "rejected",
    Pending = "pending",
}

interface TimeEntryAttrs extends Ref {
    day: Day;
    hours: number;
    description: string;
    managerId: Id;
    approvalStatus: TimeEntryApprovalStatus;
    approverId: Id | null;
}

export class TimeEntry extends Struct<TimeEntryAttrs>() {
    approve(approverId: Id): TimeEntry {
        return this._update({ approvalStatus: TimeEntryApprovalStatus.Approved, approverId });
    }
}
