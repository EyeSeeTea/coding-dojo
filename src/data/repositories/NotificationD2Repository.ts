import { Notification } from "../../domain/entities/Notification";
import { NotificationRecipient } from "../../domain/entities/NotificationRecipient";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { D2Api } from "../../types/d2-api";

export class NotificationD2Repository implements NotificationRepository {
    constructor(private api: D2Api) {}

    send(notification: Notification, recipient: NotificationRecipient): FutureData<void> {
        return apiToFuture(
            this.api.email.sendMessage({
                text: notification.message,
                subject: notification.title,
                recipients: [recipient.email],
            })
        );
    }
}
