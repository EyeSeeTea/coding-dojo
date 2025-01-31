import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { ApprovalStatuses, TimeTracking } from "../entities/TimeTracking";

export interface TimeTrackingRepository {
    get(): FutureData<TimeTracking[]>;
    getByManager(managerId: Id): FutureData<TimeTracking[]>;
    getById(id: Id): FutureData<TimeTracking>;
    updateStatus(id: Id, status: ApprovalStatuses): FutureData<void>;
}
