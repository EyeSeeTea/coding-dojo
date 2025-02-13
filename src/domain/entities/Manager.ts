import { Struct } from "./generic/Struct";
import { NamedRef } from "./Ref";

export type ManagerAttrs = NamedRef & {
    email: string;
};

export class Manager extends Struct<ManagerAttrs>() {}
