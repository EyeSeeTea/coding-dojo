import { D2Api } from "@eyeseetea/d2-api/2.36";
import { NotificationMessage } from "../../domain/entities/NotificationMessage";
import { NotificationMessageRepository } from "../../domain/repositories/NotificationMessageRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";

export class NotificationMessageD2Repository implements NotificationMessageRepository {
    constructor(private api: D2Api) {}
    send(notification: NotificationMessage): FutureData<void> {
        const user = notification.recipient.id;
        return apiToFuture(
            this.api.messageConversations.post({
                subject: notification.id,
                text: notification.message,
                users: [{ id: user }],
            })
        ).flatMap(() => Future.success(undefined));
    }
}
