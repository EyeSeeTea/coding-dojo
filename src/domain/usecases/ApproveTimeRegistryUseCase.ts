import { FutureData, Stat } from "../../data/api-futures";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { TimeRegistry } from "../entities/TimeRegistry";
import { ManagerRepository } from "../repositories/ManagerRepository";
import { TimeRegistryRepository } from "../repositories/TimeRegistryRepository";
import { NotificationService } from "../services/NotificationService";

export class ReviewTimeRegistryUseCase {
    constructor(
        private timeRegistryRepository: TimeRegistryRepository,
        private managerRepository: ManagerRepository,
        private notificationService: NotificationService
    ) {}

    public execute(timeRegistry: TimeRegistry, managerId: Id): FutureData<Stat> {
        return this.managerRepository
            .getById(managerId)
            .flatMap(manager =>
                Future.joinObj({
                    stat: this.timeRegistryRepository.save(timeRegistry.approve(managerId)),
                    manager: Future.success(manager),
                })
            )
            .map(({ stat, manager }) => {
                if (stat === "updated" && manager)
                    this.notificationService.send(manager.email, "Time registry approved");
                return stat;
            });
    }
}
