import { ISODateString, Id } from "./Ref";
import { Either } from "./generic/Either";
import { Struct } from "./generic/Struct";

export type TimeTrackingAttrs = {
    id: Id;
    managerId: Id;
    hours: number;
    date: ISODateString; // yyyy-mm-dd
    status: TimeTrackingStatus;
};

export const timeTrackingStatus = ["approval", "pending"] as const;
export type TimeTrackingStatus = (typeof timeTrackingStatus)[number];

export type CalendarDay = {
    day: number;
    month: number;
    year: number;
};

export type ManagerAttrs = {
    id: Id;
    firstName: string;
    lastName: string;
    email: string;
};

export class Manager extends Struct<ManagerAttrs>() {
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}

export class TimeTracking extends Struct<TimeTrackingAttrs>() {
    static create(attrs: TimeTrackingAttrs): Either<Error, TimeTracking> {
        if (attrs.hours < 0) return Either.error(new Error("Hours must be greater than 0"));
        if (!attrs.date) throw new Error("Date is required");
        if (!attrs.managerId) throw new Error("Manager id is required");

        // const currentStatus = timeTrackingStatus.find(status => status === data.status);
        // if (!currentStatus) throw new Error("Invalid status");

        return Either.success(new TimeTracking(attrs));
    }

    approve(): TimeTracking {
        // if (this.isApproved()) throw new Error("Time tracking is already approved");
        return this._update({ status: "approval" });
    }

    isApproved(): boolean {
        return this.status === "approval";
    }
}
