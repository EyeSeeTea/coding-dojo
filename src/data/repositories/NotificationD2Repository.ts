import { D2Api } from "@eyeseetea/d2-api/2.36";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { Notification } from "../../domain/entities/Notification";

export class NotificationD2Repository implements NotificationRepository {
    constructor(private api: D2Api) {}

    send(notification: Notification): FutureData<void> {
        return apiToFuture(
            this.api.messageConversations.post({
                text: notification.title,
                subject: notification.body,
                users: [{ id: notification.recipient.id }],
            })
        );
    }
}
