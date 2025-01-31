import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { TimeTracking } from "../entities/TimeTracking";

export type TimeTrackingFilters = {
    managerId?: Id;
    timeTrackingIds?: Id[];
};

export interface TimeTrackingRepository {
    get(filters?: TimeTrackingFilters): FutureData<TimeTracking[]>;
    save(timeTrackings: TimeTracking[]): FutureData<void>;
}
