import { TimeRecord } from "../entities/TimeRecord";
import { Manager } from "../entities/Manager";
import { NotificationMessage } from "../entities/NotificationMessage";
import { Id } from "../entities/Ref";
import _c from "../entities/generic/Collection";
import { FutureData } from "../../data/api-futures";
import { Future } from "../entities/generic/Future";
import { HashMap } from "../entities/generic/HashMap";
import { TimeRecordRepository } from "../repositories/TimeRecordRepository";
import { ManagerRepository } from "../repositories/ManagerRepository";
import { NotificationRepository } from "../repositories/NotificationRepository";

const concurrency = 10;

export class ApproveTimeRecordUseCase {
    constructor(
        private timeRecordRepository: TimeRecordRepository,
        private managerRepository: ManagerRepository,
        private notificationRepository: NotificationRepository
    ) {}

    execute({ timeRecordIds }: { timeRecordIds: Id[] }): FutureData<void> {
        return this.timeRecordRepository
            .get({ Ids: timeRecordIds })
            .flatMap(records => this.approveAndSave(records))
            .flatMap(this.sendNotificationsToManagers);
    }

    private approveAndSave(timeRecords: TimeRecord[]): FutureData<TimeRecord[]> {
        const approvedTimeRecords = TimeRecord.approve(timeRecords);
        return Future.parallel(
            approvedTimeRecords.map(record => this.timeRecordRepository.save(record)),
            {
                concurrency,
            }
        );
    }

    private sendNotificationsToManagers(timeRecords: TimeRecord[]): FutureData<void> {
        const managerIds = _c(timeRecords)
            .map(r => r.managerId)
            .uniq()
            .value();

        return this.getManagerMap(managerIds)
            .map(managerMap => timeRecords.map(r => this.saveAndSendNotification(managerMap, r)))
            .map(notifFutures => Future.parallel(notifFutures, { concurrency }))
            .map(() => undefined);
    }

    private getManagerMap(managerIds: Id[]): FutureData<HashMap<Id, Manager>> {
        return this.managerRepository
            .get({ Ids: managerIds })
            .map(managers => _c(managers).keyBy(m => m.id));
    }

    private saveAndSendNotification(
        managerMap: HashMap<Id, Manager>,
        timeRecord: TimeRecord
    ): FutureData<void> {
        const manager = managerMap.get(timeRecord.managerId);
        return manager
            ? this.notificationRepository
                  .save(
                      NotificationMessage.create({
                          recipient: manager.email,
                          title: `Time record ${timeRecord.id} has been approved`,
                          body: `Time record ${timeRecord.id} has been approved. 
                                     description: "${timeRecord.description}"
                                     hours: ${timeRecord.hours}`,
                      })
                  )
                  .flatMap(this.notificationRepository.send)
            : Future.success(undefined);
    }
}
