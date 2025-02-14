import { Id, NamedRef } from "./Ref";

export interface Manager extends NamedRef {
    email: string;
    userId: Id;
    orgUnitId: Id; // do not contaminate the domain entity with orgUnitId if it's not needed
}
