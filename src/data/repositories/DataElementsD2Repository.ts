import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { DataElement } from "../../domain/entities/DataElement";
import { DataElementRepository } from "../../domain/repositories/DataElementRepository";

export class DataElementsD2Repository implements DataElementRepository {
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
