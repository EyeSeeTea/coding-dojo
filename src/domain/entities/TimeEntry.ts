import { Day } from "./Day";
import { Struct } from "./generic/Struct";
import { Id, Ref } from "./Ref";
import { User } from "./User";

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
    approver: User | null;
}

export class TimeEntry extends Struct<TimeEntryAttrs>() {
    approve(approver: User) {
        this.approvalStatus = TimeEntryApprovalStatus.Approved;
        this.approver = approver;
    }
}
