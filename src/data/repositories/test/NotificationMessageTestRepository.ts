import { Future } from "../../../domain/entities/generic/Future";
import { NotificationMessage } from "../../../domain/entities/NotificationMessage";
import { NotificationMessageRepository } from "../../../domain/repositories/NotificationMessageRepository";
import { FutureData } from "../../api-futures";

export class NotificationMessageTestRepository implements NotificationMessageRepository {
    send(_notification: NotificationMessage): FutureData<void> {
        return Future.success(undefined);
    }
}
