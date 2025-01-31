import { FutureData } from "../../data/api-futures";
import { generateUid } from "../../utils/uid";
import { Future } from "../entities/generic/Future";
import { NotificationMessage } from "../entities/NotificationMessage";
import { Id } from "../entities/Ref";
import { TimeTracking } from "../entities/TimeTracking";
import { NotificationMessageRepository } from "../repositories/NotificationMessageRepository";
import { TimeTrackingRepository } from "../repositories/TimeTrackingRepository";

export class ApproveTimeTrackingUseCase {
    constructor(
        private timeTrackingRepository: TimeTrackingRepository,
        private notificationMessageRepository: NotificationMessageRepository
    ) {}

    public execute(id: Id): FutureData<void> {
        return this.timeTrackingRepository.getById(id).flatMap((timeTracking: TimeTracking) => {
            if (timeTracking.approvalStatus === "APPROVED") {
                console.debug("Time tracking is already approved, nothing to do");
                return Future.success(undefined);
            }

            return this.timeTrackingRepository.updateStatus(id, "APPROVED").flatMap(() => {
                const message: NotificationMessage = {
                    id: generateUid(),
                    message: "Time tracking approved",
                    recipient: timeTracking.manager,
                };
                return this.notificationMessageRepository.send(message);
            });
        });
    }
}
