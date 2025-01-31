import { Struct } from "./generic/Struct";
import { Id, Ref } from "./Ref";

export interface TimeTrackingAttributes extends Ref {
    managerId: Id;
    day: Date;
    hours: number;
    description: string;
    approved: boolean;
}

export class TimeTracking extends Struct<TimeTrackingAttributes>() {
    approve(): TimeTracking {
        return this._update({ approved: true });
    }
}
