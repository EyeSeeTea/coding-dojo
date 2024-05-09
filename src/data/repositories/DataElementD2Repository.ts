import { DataElement } from "../../domain/entities/DataElement";
import { DataElementRepository } from "../../domain/repositories/DataElementRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";

export class DataElementD2Repository implements DataElementRepository {
    constructor(private api: D2Api) {}

    public getAll(): FutureData<DataElement[]> {
        return apiToFuture(
            this.api.metadata.get({
                dataElements: {
                    fields: {
                        id: true,
                        name: true,
                    },
                },
            })
        ).map(({ dataElements }) => {
            return dataElements;
        });
    }
}
