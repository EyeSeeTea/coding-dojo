import { D2Api } from "@eyeseetea/d2-api/2.36";
import { Id } from "../../domain/entities/Ref";
import { ManagerRepository } from "../../domain/repositories/ManagerRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { Manager } from "../../domain/entities/Manager";
import { Maybe } from "../../utils/ts-utils";

export class ManagerD2Repository implements ManagerRepository {
    constructor(private api: D2Api) {}

    getById(managerId: Id): FutureData<Maybe<Manager>> {
        return apiToFuture(
            this.api.models.trackedEntityInstances
                .get({
                    fields: {
                        id: true,
                        name: true,
                        trackedEntityAttributeValues: true, // email
                    },
                    filter: {
                        id: {
                            eq: managerId,
                        },
                    },
                    paging: false,
                })
                .map(res => {
                    const tei = res.data.objects[0];
                    return this.mapTeiToManager(tei);
                })
        );
    }

    private mapTeiToManager(tei: any): Manager {
        const email = tei.trackedEntityAttributeValues.find(
            (tea: any) => tea.trackedEntityAttribute.id === "email"
        ).value;

        if (!email) throw new Error("Manager email not found");

        return {
            id: tei.id,
            name: tei.name,
            email: email,
        };
    }
}
