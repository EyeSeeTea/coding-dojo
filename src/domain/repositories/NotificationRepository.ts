import { FutureData } from "../../data/api-futures";
import { NotificationMessage } from "../entities/NotificationMessage";

export interface NotificationRepository {
    save(notification: NotificationMessage): FutureData<NotificationMessage>;
    send(notification: NotificationMessage): FutureData<void>;
}
