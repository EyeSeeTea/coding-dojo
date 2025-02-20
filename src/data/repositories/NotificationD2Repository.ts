import { D2Api } from "../../types/d2-api";
import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import { FutureData, apiToFuture } from "../api-futures";

export class NotificationD2Repository implements NotificationRepository {
    constructor(private api: D2Api) {}

    send(notification: Notification): FutureData<void> {
        return apiToFuture(
            this.api.messageConversations.post({
                subject: notification.title,
                text: notification.body,
                users: notification.recipients.map(recipient => ({ id: recipient })),
            })
        );
    }
}
