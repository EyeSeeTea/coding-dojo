import { FutureData } from "../../data/api-futures";
import { Struct } from "./generic/Struct";

export type NotificationMessageAtts = {
    recipient: string;
    body: string;
    title: string;
};
export class NotificationMessage extends Struct<NotificationMessageAtts>() {}

export interface NotificationRepository {
    save(notification: NotificationMessage): FutureData<NotificationMessage>;
    send(notification: NotificationMessage): FutureData<void>;
}
