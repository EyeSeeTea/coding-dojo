import { DataElement } from "../../../domain/entities/DataElement";
import { Future } from "../../../domain/entities/generic/Future";
import { DataElementRepository } from "../../../domain/repositories/DataElementRepository";
import { FutureData } from "../../api-futures";

export class DataElementTestRepository implements DataElementRepository {
    getAll(): FutureData<DataElement[]> {
        return Future.success([
            {
                id: "abc",
                name: "DataElement abc",
            },
            {
                id: "def",
                name: "DataElement def",
            },
            {
                id: "ghi",
                name: "DataElement ghi",
            },
        ]);
    }
}
