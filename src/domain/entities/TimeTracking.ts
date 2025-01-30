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
    //TODO: Add required validations if exists

    approve(): TimeTracking {
        return this._update({ approved: true });
    }
}
