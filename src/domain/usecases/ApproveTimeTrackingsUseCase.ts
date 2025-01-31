import { FutureData } from "../../data/api-futures";
import { generateUid } from "../../utils/uid";
import { Future } from "../entities/generic/Future";
import _ from "../entities/generic/Collection";
import { Notification } from "../entities/Notification";
import { Id } from "../entities/Ref";
import { TimeTracking } from "../entities/TimeTracking";
import { User } from "../entities/User";
import { ManagerRepository } from "../repositories/ManagerRepository";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { TimeTrackingRepository } from "../repositories/TimeTrackingRepository";

export class ApproveTimeTrackingsUseCase {
    constructor(
        private timeTrackingReposiory: TimeTrackingRepository,
        private managerRepository: ManagerRepository,
        private notificationRepository: NotificationRepository
    ) {}

    public execute(currentUser: User, timeTrackingIdsToApprove: Id[]): FutureData<void> {
        if (!currentUser.hasApprovalPermissions()) {
            return Future.error(new Error("You don't have permission to approve time trackings"));
        }

        return this.timeTrackingReposiory
            .get({
                timeTrackingIds: timeTrackingIdsToApprove,
            })
            .flatMap(timeTrackingsToApprove => {
                const approvedTimeTrackings = timeTrackingsToApprove.map(timeTrackingToApprove =>
                    timeTrackingToApprove.approve()
                );

                return this.timeTrackingReposiory.save(approvedTimeTrackings).flatMap(() => {
                    return this.sendNotificationsToManagers(approvedTimeTrackings);
                });
            });
    }

    private sendNotificationsToManagers(approvedTimeTrackings: TimeTracking[]): FutureData<void> {
        const uniqManagerIdsToSendNotification = _(
            approvedTimeTrackings.map(timeTracking => timeTracking.managerId)
        )
            .uniq()
            .toArray();

        return this.managerRepository
            .get({
                managerIds: uniqManagerIdsToSendNotification,
            })
            .flatMap(managersToSendNotification => {
                const uniqueManagerUserIdsToSendNotification = _(
                    managersToSendNotification.map(manager => manager.userId)
                )
                    .uniq()
                    .toArray();

                const notifications: Notification[] = uniqueManagerUserIdsToSendNotification.map(
                    (managerUserId): Notification => {
                        return {
                            id: generateUid(),
                            subject: "Time trackings approved",
                            userId: managerUserId,
                            message: "Your time trackings have been approved",
                        };
                    }
                );

                return Future.parallel(
                    notifications.map(notification =>
                        this.notificationRepository.send(notification)
                    ),
                    { concurrency: 5 }
                ).flatMap(() => {
                    return Future.success(undefined);
                });
            });
    }
}
