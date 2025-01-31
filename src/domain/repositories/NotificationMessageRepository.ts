import { FutureData } from "../../data/api-futures";
import { NotificationMessage } from "../entities/NotificationMessage";

export interface NotificationMessageRepository {
    send(notification: NotificationMessage): FutureData<void>;
}
