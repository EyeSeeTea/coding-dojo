import { D2Api } from "../../types/d2-api";
import { DataElement } from "../../domain/entities/DataElement";
import { DataElementRepository } from "../../domain/repositories/DataElementRepository";
import { FutureData, apiToFuture } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";

export class DataElementD2Repository implements DataElementRepository {
    constructor(private api: D2Api) {}
    get(): FutureData<DataElement[]> {
        console.log("Getting dataElements...");
        return this.getAllDataElements(1, []);
    }

    private getDataElements(page: number) {
        return apiToFuture(
            this.api.models.dataElements.get({
                fields: { id: true, name: true },
                page: page,
                pageSize: 250,
            })
        );
    }

    private getAllDataElements(
        page: number,
        dataElements: DataElement[]
    ): FutureData<DataElement[]> {
        return this.getDataElements(page).flatMap(response => {
            const newDataElements = [
                ...dataElements,
                ...response.objects.map(d2DataElement => DataElement.create(d2DataElement)),
            ];
            console.log(`${newDataElements.length}/${response.pager.total}`);
            if (response.pager.page >= response.pager.pageCount) {
                return Future.success(newDataElements);
            } else {
                return this.getAllDataElements(page + 1, newDataElements);
            }
        });
    }
}
