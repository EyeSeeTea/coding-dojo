import { DataElement } from "../../../domain/entities/DataElement";
import { Future } from "../../../domain/entities/generic/Future";
import { DataElementRepository } from "../../../domain/repositories/DataElementRepository";
import { FutureData } from "../../api-futures";

export class DataElementTestRepository implements DataElementRepository {
    getAll(): FutureData<DataElement[]> {
        return Future.success([
            { id: "1", name: "Data Element 1" },
            { id: "2", name: "Data Element 2" },
        ]);
    }
}
