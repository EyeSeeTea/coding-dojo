import { Id, Ref } from "./Ref";

export interface Notification extends Ref {
    subject: string;
    userId: Id;
    message: string;
}
