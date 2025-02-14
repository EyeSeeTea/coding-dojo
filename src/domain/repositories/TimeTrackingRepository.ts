import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { ApprovalStatuses, TimeTrackingBaseAttrs } from "../entities/TimeTracking";

export interface TimeTrackingRepository {
    get(): FutureData<TimeTrackingBaseAttrs[]>;
    getByManager(managerId: Id): FutureData<TimeTrackingBaseAttrs[]>;
    getById(id: Id): FutureData<TimeTrackingBaseAttrs>;
    updateStatus(id: Id, status: ApprovalStatuses): FutureData<void>;
}
