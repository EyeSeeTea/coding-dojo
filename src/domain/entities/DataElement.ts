import { Id } from "./Ref";
import { Struct } from "./generic/Struct";

type DataElementAttrs = {
    id: Id;
    name: string;
};

export class DataElement extends Struct<DataElementAttrs>() {}
