import { FutureData } from "../../data/api-futures";
import { DataElement } from "../entities/DataElement";

export interface DataElementRepository {
    get(): FutureData<DataElement[]>;
}
