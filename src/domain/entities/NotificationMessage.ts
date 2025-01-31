import { Ref } from "./Ref";
import { User } from "./User";

export interface NotificationMessage extends Ref {
    message: string;
    recipient: User;
}
