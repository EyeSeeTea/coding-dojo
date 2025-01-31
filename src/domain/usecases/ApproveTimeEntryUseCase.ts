import { FutureData } from "../../data/api-futures";
import { TimeEntry, TimeEntryApprovalStatus } from "../entities/TimeEntry";
import { User } from "../entities/User";
import { ManagerRepository } from "../repositories/ManagerRepository";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { TimeEntryRepository } from "../repositories/TimeEntryRepository";
import { SendTimeEntryStatusChangeNotificationUseCase } from "./SendTimeEntryStatusChangeNotificationUseCase";

export class ApproveTimeEntryUseCase {
    constructor(
        private timeEntryRepository: TimeEntryRepository,
        private notificationRepository: NotificationRepository,
        private managerRepository: ManagerRepository
    ) {}

    public execute(timeEntry: TimeEntry, approver: User): FutureData<void> {
        const sendNotificationUseCase = new SendTimeEntryStatusChangeNotificationUseCase(
            this.notificationRepository,
            this.managerRepository
        );
        const timeEntryUpdated: TimeEntry = {
            ...timeEntry,
            approvalStatus: TimeEntryApprovalStatus.Approved,
            approver,
        };
        return this.timeEntryRepository
            .update(timeEntryUpdated)
            .flatMap(() => sendNotificationUseCase.execute(timeEntryUpdated));
    }
}
