import { Id, NamedRef } from "./Ref";

export interface Manager extends NamedRef {
    email: string;
    userId: Id;
}
