import { DataElement } from "../../domain/entities/DataElement";
import { DataElementRepository } from "../../domain/repositories/DataElementRepository";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";

export class DataElementD2Repository implements DataElementRepository {
    constructor(private api: D2Api) {}

    public get(): FutureData<DataElement[]> {
        return apiToFuture(
            this.api.metadata.get({
                dataElements: {
                    fields: { displayName: true, id: true },
                },
            })
        ).map(res => {
            const dataElements = this.buildDataElements(res.dataElements);
            return dataElements;
        });
    }

    private buildDataElements(d2DataElements: D2DataElement[]): DataElement[] {
        return d2DataElements.map(dataElement => ({
            id: dataElement.id,
            name: dataElement.displayName,
        }));
    }
}

const dataElementFields = { displayName: true, id: true } as const;

type D2DataElement = MetadataPick<{
    dataElements: { fields: typeof dataElementFields };
}>["dataElements"][number];
