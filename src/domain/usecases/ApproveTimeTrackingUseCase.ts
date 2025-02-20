import { FutureData } from "../../data/api-futures";
import { Notification } from "../entities/Notification";
import { Id } from "../entities/Ref";
import { TimeTracking } from "../entities/TimeTracking";
import { Future } from "../entities/generic/Future";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { TimeTrackingRepository } from "../repositories/TimeTrackingRepository";
import { UserRepository } from "../repositories/UserRepository";

export class ApproveTimeTrackingUseCase {
    constructor(
        private userRepository: UserRepository,
        private timeTrackingRepository: TimeTrackingRepository,
        private notificationRepository: NotificationRepository
    ) {}

    execute(timeTrackingId: Id): FutureData<TimeTracking> {
        return this.userRepository.getCurrent().flatMap(user => {
            if (user.isAdmin()) {
                return this.approveTimeTracking(timeTrackingId).flatMap(approvedTimeTracking => {
                    return this.sendNotification(approvedTimeTracking).map(
                        () => approvedTimeTracking
                    );
                });
            } else {
                return Future.error(new Error("User does not have permissions"));
            }
        });
    }

    private approveTimeTracking(timeTrackingId: Id): FutureData<TimeTracking> {
        return this.timeTrackingRepository.getById(timeTrackingId).flatMap(timeTracking => {
            const approvedTimeTracking = timeTracking.approve();
            return this.timeTrackingRepository
                .save(approvedTimeTracking)
                .map(() => approvedTimeTracking);
        });
    }

    private sendNotification(timeTracking: TimeTracking): FutureData<void> {
        const notificationToSend: Notification = {
            body: `Time tracking ${timeTracking.id} has been approved`,
            recipients: [timeTracking.managerId],
            title: "Time tracking approved",
        };
        return this.notificationRepository.send(notificationToSend);
    }
}
