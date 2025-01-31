import { FutureData } from "../../data/api-futures";
import i18n from "../../utils/i18n";
import { Notification } from "../entities/Notification";
import { TimeEntry } from "../entities/TimeEntry";
import { ManagerRepository } from "../repositories/ManagerRepository";
import { NotificationRepository } from "../repositories/NotificationRepository";

export class SendTimeEntryStatusChangeNotificationUseCase {
    constructor(
        private notificationRepository: NotificationRepository,
        private managerRepository: ManagerRepository
    ) {}

    public execute(timeEntryUpdated: TimeEntry): FutureData<void> {
        const notification: Notification = {
            title: i18n.t("Time entry status change"),
            message: i18n.t(`Time entry {{timeEntryId}} status changed to {{timeEntryStatus}}`, {
                timeEntryId: timeEntryUpdated.id,
                timeEntryStatus: timeEntryUpdated.approvalStatus,
            }),
        };
        return this.managerRepository.getById(timeEntryUpdated.managerId).flatMap(manager => {
            return this.notificationRepository.send(notification, manager);
        });
    }
}
