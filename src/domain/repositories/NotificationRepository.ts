import { FutureData } from "../../data/api-futures";
import { Notification } from "../entities/Notification";
import { NotificationRecipient } from "../entities/NotificationRecipient";

export interface NotificationRepository {
    send(notification: Notification, recipient: NotificationRecipient): FutureData<void>;
}
