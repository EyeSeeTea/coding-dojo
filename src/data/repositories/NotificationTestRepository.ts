import { Notification } from "../../domain/entities/Notification";
import { Future } from "../../domain/entities/generic/Future";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import { FutureData } from "../api-futures";

export class NotificationTestRepository implements NotificationRepository {
    send(_notification: Notification): FutureData<void> {
        return Future.success(undefined);
    }
}
