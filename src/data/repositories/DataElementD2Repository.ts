import { DataElement } from "../../domain/entities/DataElement";
import { DataElementRepository } from "../../domain/repositories/DataElementRepository";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";

export class DataElementD2Repository implements DataElementRepository {
    constructor(private api: D2Api) {}
    get(): FutureData<DataElement[]> {
        return apiToFuture(
            this.api.models.dataElements.get({
                fields: dataElementsFields,
            })
        ).map(response => {
            const res = response.objects.map(this.buildDataElement);
            return res;
        });
    }

    private buildDataElement(d2User: D2DataElement): DataElement {
        return {
            id: d2User.id,
            name: d2User.displayName,
        };
    }
}

const dataElementsFields = {
    id: true,
    displayName: true,
    userGroups: { id: true, name: true },
} as const;

type D2DataElement = MetadataPick<{
    dataElements: { fields: typeof dataElementsFields };
}>["dataElements"][number];
