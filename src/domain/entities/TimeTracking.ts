import { Struct } from "./generic/Struct";
import { NamedRef } from "./Ref";
import { User } from "./User";

export type ApprovalStatuses = "APPROVED" | "REJECTED" | "PENDING";

interface TimeTrackingAttrs extends NamedRef {
    date: Date;
    hours: number;
    description: string;
    approvalStatus: ApprovalStatuses;
    manager: User;
}

export class TimeTracking extends Struct<TimeTrackingAttrs>() {
    validate(): Error[] {
        const errors: Error[] = [];
        if (this.hours <= 0) {
            errors.push(new Error("Hours must be greater than 0"));
        } else if (this.hours >= 24) {
            errors.push(new Error("Hours must be less than 24"));
        } else if (!this.manager.isManager()) {
            errors.push(new Error("Only managers can create time tracking entries"));
        }
        return errors;
    }
}
