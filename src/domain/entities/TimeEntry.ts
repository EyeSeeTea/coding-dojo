import { Day } from "./Day";
import { Manager } from "./Manager";
import { Id, Ref } from "./Ref";
import { User } from "./User";

export enum TimeEntryApprovalStatus {
    Approved = "approved",
    Rejected = "rejected",
    Pending = "pending",
}

interface TimeEntryBase extends Ref {
    day: Day;
    hours: number;
    description: string;
    managerId: Id;
}

interface PendingTimeEntry extends TimeEntryBase {
    approvalStatus: TimeEntryApprovalStatus.Pending;
    approver: null;
}

interface ReviewedTimeEntry extends TimeEntryBase {
    approvalStatus: TimeEntryApprovalStatus.Approved | TimeEntryApprovalStatus.Rejected;
    approver: User;
}

export type TimeEntry = PendingTimeEntry | ReviewedTimeEntry;

export type TimeEntryWithManager = TimeEntry & { manager: Manager };
