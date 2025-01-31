import { Struct } from "./generic/Struct";

export type NotificationMessageAtts = {
    recipient: string;
    body: string;
    title: string;
};
export class NotificationMessage extends Struct<NotificationMessageAtts>() {}
