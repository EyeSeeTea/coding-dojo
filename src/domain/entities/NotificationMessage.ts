import { Struct } from "./generic/Struct";

export type NotificationMessageAttrs = {
    recipient: string;
    body: string;
    title: string;
};
export class NotificationMessage extends Struct<NotificationMessageAttrs>() {}
