import { TimeTrackingRepository } from "../repositories/TimeTrackingRepository";
import { ManagerRepository } from "../repositories/ManagerRepository";
import { FutureData } from "../../data/api-futures";
import { Future } from "../entities/generic/Future";
import { Manager } from "../entities/Manager";
import { User } from "../entities/User";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { Notification } from "../entities/Notification";

export class ApproveTimeTrackingUseCase {
    constructor(
        private timeTrackingRepository: TimeTrackingRepository,
        private managerRepository: ManagerRepository,
        private notificationRepository: NotificationRepository
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

    private sendApprovalNotification(manager: Manager): FutureData<void> {
        // Send notification to the manager on approval
        const notification = this.buildApprovalNotification(manager);
        return this.notificationRepository.send(notification);
    }

    private buildApprovalNotification(manager: Manager): Notification {
        const notification: Notification = {
            title: "Time tracking entry approved",
            body: "Your time tracking entry has been approved.",
            recipient: manager,
        };

        return notification;
    }
}
