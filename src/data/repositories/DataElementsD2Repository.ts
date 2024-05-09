import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { DataElement } from "../../domain/entities/DataElement";
import { DataElementsRepository } from "../../domain/repositories/DataElementsRepository";

export class DataElementsD2Repository implements DataElementsRepository {
    constructor(private api: D2Api) {}

    public getAll(): FutureData<DataElement[]> {
        return apiToFuture(
            this.api.metadata.get({
                dataElements: {
                    fields: DataElementFields,
                },
                paging: false,
            })
        ).map(data => {
            return data.dataElements;
        });
    }
}

const DataElementFields = {
    id: true,
    name: true,
} as const;
