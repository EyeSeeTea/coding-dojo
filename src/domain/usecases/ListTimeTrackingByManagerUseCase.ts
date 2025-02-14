import { FutureData } from "../../data/api-futures";
import { Future } from "../entities/generic/Future";
import { TimeTracking } from "../entities/TimeTracking";
import { User } from "../entities/User";
import { TimeTrackingRepository } from "../repositories/TimeTrackingRepository";

export class ListTimeTrackingByManagerUseCase {
    constructor(private timeTrackingRepository: TimeTrackingRepository) {}

    execute(currentUser: User, managerId: string): FutureData<TimeTracking[]> {
        // using isAdmin() to check if the user is authorized
        // we could also check using belongToUserGroup()
        if (!currentUser.isAdmin()) return Future.error(new Error("Unauthorized"));
        return this.timeTrackingRepository.listByManager(managerId);
    }
}
