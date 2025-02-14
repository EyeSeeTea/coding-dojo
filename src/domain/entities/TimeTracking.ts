import { Struct } from "./generic/Struct";
import { Id, Ref } from "./Ref";

export interface TimeTrackingAttributes extends Ref {
    managerId: Id;
    day: Date;
    hours: number;
    description: string;
    approved: boolean;
    orgUnitId: Id; // do not contaminate the domain entity with orgUnitId if it's not needed
}

export class TimeTracking extends Struct<TimeTrackingAttributes>() {
    // TODO: Validate hours should be non negative

    approve(): TimeTracking {
        return this._update({ approved: true });
    }
}
