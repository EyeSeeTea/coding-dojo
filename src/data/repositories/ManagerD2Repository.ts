import { Future } from "../../domain/entities/generic/Future";
import { Manager } from "../../domain/entities/Manager";
import { Id } from "../../domain/entities/Ref";
import { ManagerRepository } from "../../domain/repositories/ManagerRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";

const metadataConfig = {
    program: "id",
    programStage: "id",
    orgUnit: "rootId",
    dataElements: {
        name: "id",
        email: "id",
    },
};

const fields = {
    attributes: true,
    trackedEntity: true,
} as const;

export class ManagerD2Repository implements ManagerRepository {
    constructor(private api: D2Api) {}

    getById(id: Id): FutureData<Manager> {
        return this.getByIds([id]).flatMap(([manager]) => {
            if (!manager) return Future.error(new Error(`Manager with id ${id} not found`));
            return Future.success(manager);
        });
    }

    getByIds(ids: Id[]): FutureData<Manager[]> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: metadataConfig.program,
                programStage: metadataConfig.programStage,
                fields,
                orgUnit: metadataConfig.orgUnit,
                ouMode: "DESCENDANTS",
                trackedEntity: ids.join(";"),
            })
        ).map(response => response.instances.map(mapTrackedEntityToManager));
    }
}

// TODO:
// type D2TrackerTrackedEntity = MetadataPick<{ trackedEntityInstances: { fields: typeof fields } }>["trackedEntityInstances"][number];
// type TrackerTrackedEntity = SelectedPick<D2TrackerTrackedEntity, typeof fields>;

function mapTrackedEntityToManager({ attributes, trackedEntity }: D2TrackerTrackedEntity): Manager {
    if (!trackedEntity || !attributes)
        throw new Error("Manager Tracked entity without id or attributes");
    const getAttribute = (id: string) => attributes.find(attr => attr.attribute === id)?.value;
    const name = getAttribute(metadataConfig.dataElements.name);
    const email = getAttribute(metadataConfig.dataElements.email);
    if (!name || !email) throw new Error("Manager Tracked entity without name or email");
    return {
        id: trackedEntity,
        name,
        email,
    };
}
