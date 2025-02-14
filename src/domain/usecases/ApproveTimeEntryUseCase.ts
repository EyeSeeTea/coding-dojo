import { FutureData } from "../../data/api-futures";
import { Notification } from "../entities/Notification";
import { TimeEntry } from "../entities/TimeEntry";
import { ManagerRepository } from "../repositories/ManagerRepository";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { TimeEntryRepository } from "../repositories/TimeEntryRepository";
import { UserRepository } from "../repositories/UserRepository";

export class ApproveTimeEntryUseCase {
    constructor(
        private timeEntryRepository: TimeEntryRepository,
        private notificationRepository: NotificationRepository,
        private managerRepository: ManagerRepository,
        private userRepository: UserRepository
    ) {}

    public execute(timeEntry: TimeEntry): FutureData<void> {
        return this.userRepository.getCurrent().flatMap(approver => {
            const approvedTimeEntry = timeEntry.approve(approver.id);

            const notification: Notification = {
                title: "Time entry approved",
                message: `Time entry ${approvedTimeEntry.id} status changed to ${approvedTimeEntry.approvalStatus}`,
            };

            return this.timeEntryRepository.update(approvedTimeEntry).flatMap(() =>
                this.managerRepository.getById(approvedTimeEntry.managerId).flatMap(manager => {
                    return this.notificationRepository.send(notification, manager);
                })
            );
        });
    }
}
