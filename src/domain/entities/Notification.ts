import { Manager } from "./Manager";

export type Notification = {
    title: string;
    body: string;
    recipient: Manager;
};
