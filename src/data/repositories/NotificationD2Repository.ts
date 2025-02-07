import { NotificationRepository } from "../../domain/repositories/NotificationRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { Notification } from "../../domain/entities/Notification";

export class NotificationD2Repository implements NotificationRepository {
    constructor(private api: D2Api) {}

    send(notification: Notification): FutureData<void> {
        const { subject, message, userId } = notification;

        return apiToFuture(
            this.api.messageConversations.post({
                subject: subject,
                text: message,
                users: [{ id: userId }],
            })
        );
    }
}
