import { DataElement } from "../../domain/entities/DataElement";
import { DataElementRepository } from "../../domain/repositories/DataElementRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";

export class DataElementD2Repository implements DataElementRepository {
    constructor(private api: D2Api) {}
    getAll(): FutureData<DataElement[]> {
        return apiToFuture(
            this.api.models.dataElements.get({ fields: { id: true, name: true }, paging: false })
        ).map(resp => {
            return resp.objects.map(d2DataElement => {
                return { id: d2DataElement.id, name: d2DataElement.name };
            });
        });
    }
}
