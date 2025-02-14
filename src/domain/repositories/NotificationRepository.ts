import { FutureData } from "../../data/api-futures";
import { Notification } from "../entities/Notification";

export interface NotificationRepository {
    send(notification: Notification): FutureData<void>;
}
