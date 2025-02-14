import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { TimeTracking } from "../entities/TimeTracking";

export interface TimeTrackingRepository {
    listByManager(managerId: string): FutureData<TimeTracking[]>;
    getById(id: string): FutureData<Maybe<TimeTracking>>;
    save(timeTracking: TimeTracking): FutureData<void>;
}
