import { Id } from "./Ref";
import { Struct } from "./generic/Struct";

export interface ManagerAttrs {
    id: Id;
    firstName: string;
    lastName: string;
    email: string;
}

export class Manager extends Struct<ManagerAttrs>() {
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
