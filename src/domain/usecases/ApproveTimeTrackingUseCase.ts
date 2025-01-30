import { TimeTrackingRepository } from "../repositories/TimeTrackingRepository";
import { ManagerRepository } from "../repositories/ManagerRepository";
import { FutureData } from "../../data/api-futures";
import { Future } from "../entities/generic/Future";
import { Manager } from "../entities/Manager";
import { User } from "../entities/User";

export class ApproveTimeTrackingUseCase {
    constructor(
        private timeTrackingRepository: TimeTrackingRepository,
        private managerRepository: ManagerRepository
    ) {}

    execute(currentUser: User, managerId: string, timeTrackingId: string): FutureData<void> {
        // using isAdmin() to check if the user is authorized
        // we could also check using belongToUserGroup()
        if (!currentUser.isAdmin()) return Future.error(new Error("Unauthorized"));

        return this.managerRepository.getById(managerId).flatMap(manager => {
            if (!manager) return Future.error(new Error("Manager not found."));
            return this.timeTrackingRepository.getById(timeTrackingId).flatMap(timeTracking => {
                if (!timeTracking) return Future.error(new Error("Time tracking entry not found."));

                const approvedTimeTracking = timeTracking.approve();
                return this.timeTrackingRepository
                    .save(approvedTimeTracking)
                    .flatMap(() => this.sendApprovalNotification(manager));
            });
        });
    }

    private sendApprovalNotification(_manager: Manager): FutureData<void> {
        // Send notification to the manager on approval
        return Future.success(undefined);
    }
}
