import { FutureData } from "../../data/api-futures";
import { Notification } from "../entities/Notification";
import { TimeEntry } from "../entities/TimeEntry";
import { User } from "../entities/User";
import { ManagerRepository } from "../repositories/ManagerRepository";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { TimeEntryRepository } from "../repositories/TimeEntryRepository";

export class ApproveTimeEntryUseCase {
    constructor(
        private timeEntryRepository: TimeEntryRepository,
        private notificationRepository: NotificationRepository,
        private managerRepository: ManagerRepository
    ) {}

    public execute(timeEntry: TimeEntry, approver: User): FutureData<void> {
        timeEntry.approve(approver);

        const notification: Notification = {
            title: "Time entry status change",
            message: `Time entry ${timeEntry.id} status changed to ${timeEntry.approvalStatus}`,
        };

        return this.timeEntryRepository.update(timeEntry).flatMap(() =>
            this.managerRepository.getById(timeEntry.managerId).flatMap(manager => {
                return this.notificationRepository.send(notification, manager);
            })
        );
    }
}
