import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { TimeTracking } from "../entities/TimeTracking";

export interface TimeTrackingRepository {
    get(options: GetTimeTrackingOptions): FutureData<Paginated<TimeTracking>>;
    getById(id: Id): FutureData<TimeTracking>;
    save(timeTracking: TimeTracking): FutureData<void>;
}

export type GetTimeTrackingOptions = {
    timeTrackingId?: Id;
    page: number;
    pageSize: number;
    managerId?: Id;
};
export type Paginated<T> = { data: T[]; total: number; page: number; pageSize: number };
