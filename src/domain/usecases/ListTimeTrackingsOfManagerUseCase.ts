import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { TimeTracking } from "../entities/TimeTracking";
import { TimeTrackingRepository } from "../repositories/TimeTrackingRepository";

export class ListTimeTrackingsOfManagerUseCase {
    constructor(private timeTrackingReposiory: TimeTrackingRepository) {}

    public execute(managerId: Id): FutureData<TimeTracking[]> {
        return this.timeTrackingReposiory.get({
            managerId: managerId,
        });
    }
}
