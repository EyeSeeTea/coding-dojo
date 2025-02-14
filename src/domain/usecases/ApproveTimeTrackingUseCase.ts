import { FutureData } from "../../data/api-futures";
import { generateUid } from "../../utils/uid";
import { Future } from "../entities/generic/Future";
import { NotificationMessage } from "../entities/NotificationMessage";
import { Id } from "../entities/Ref";
import { TimeTrackingBaseAttrs } from "../entities/TimeTracking";
import { NotificationMessageRepository } from "../repositories/NotificationMessageRepository";
import { TimeTrackingRepository } from "../repositories/TimeTrackingRepository";
import { UserRepository } from "../repositories/UserRepository";

export class ApproveTimeTrackingUseCase {
    constructor(
        private options: {
            timeTrackingRepository: TimeTrackingRepository;
            notificationMessageRepository: NotificationMessageRepository;
            userRepository: UserRepository;
        }
    ) {}

    public execute(id: Id): FutureData<void> {
        return this.options.timeTrackingRepository
            .getById(id)
            .flatMap((timeTracking: TimeTrackingBaseAttrs) => {
                if (timeTracking.approvalStatus === "APPROVED") {
                    console.debug("Time tracking is already approved, nothing to do");
                    return Future.success(undefined);
                }
                return this.options.userRepository
                    .getManager(timeTracking.managerId)
                    .flatMap(manager => {
                        return this.options.timeTrackingRepository
                            .updateStatus(id, "APPROVED")
                            .flatMap(() => {
                                const message: NotificationMessage = {
                                    id: generateUid(),
                                    message: "Time tracking approved",
                                    recipient: manager,
                                };
                                return this.options.notificationMessageRepository.send(message);
                            });
                    });
            });
    }
}
