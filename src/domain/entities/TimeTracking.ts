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
    validate(data: TimeTrackingAttrs): Error[] {
        const errors: Error[] = [];
        if (data.hours <= 0) {
            errors.push(new Error("Hours must be greater than 0"));
        } else if (data.hours >= 24) {
            errors.push(new Error("Hours must be less than 24"));
        } else if (!data.manager.isManager()) {
            errors.push(new Error("Only managers can create time tracking entries"));
        }
        return errors;
    }
}
