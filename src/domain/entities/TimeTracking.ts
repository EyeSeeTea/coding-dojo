import { Either } from "./generic/Either";
import { Struct } from "./generic/Struct";

type Day = {
    year: number;
    month: number;
    day: number;
};

export type TimeTrackingAttrs = {
    id: string;
    managerId: string;
    date: Day;
    description: string;
    approved: boolean;
};

export class TimeTracking extends Struct<TimeTrackingAttrs>() {
    static validate(attrs: TimeTrackingAttrs) {
        if (!attrs.id) return Either.error(new Error("id is required"));

        return Either.success(attrs);
    }

    approve(): TimeTracking {
        return this._update({ approved: true });
    }
}
