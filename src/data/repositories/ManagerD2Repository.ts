import { Future } from "../../domain/entities/generic/Future";
import { Manager } from "../../domain/entities/Manager";
import { Id } from "../../domain/entities/Ref";
import { ManagerFilters, ManagerRepository } from "../../domain/repositories/ManagerRepository";
import { D2Api, D2TrackerTrackedEntity } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import {
    MANAGERS_TIME_TRACKING_PROGRAM_ID,
    MANAGER_ATTRIBUTE_EMAIL_ID,
    MANAGER_ATTRIBUTE_NAME_ID,
    MANAGER_ATTRIBUTE_USER_ID,
    getValueByAttributeIdFromAttributes,
} from "./common/constants";

export class ManagerD2Repository implements ManagerRepository {
    constructor(private api: D2Api) {}

    get(filters?: ManagerFilters): FutureData<Manager[]> {
        const { managerIds } = filters || {};
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: MANAGERS_TIME_TRACKING_PROGRAM_ID,
                fields: trackedEntityFields,
                ouMode: "ALL",
                trackedEntity: managerIds?.join(";"), // semicolon-delimited list of tracked entity instance UID
                // skipPaging: true,
            })
        ).flatMap(response => {
            const trackedEntities: D2TrackerTrackedEntity[] = response.instances;
            const managers = trackedEntities.map(trackedEntity =>
                this.mapTrackedEntityToManager(trackedEntity)
            );
            return Future.success(managers);
        });
    }

    getById(id: Id): FutureData<Manager> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: MANAGERS_TIME_TRACKING_PROGRAM_ID,
                fields: trackedEntityFields,
                ouMode: "ALL",
                trackedEntity: id,
                // skipPaging: true,
            })
        ).flatMap(response => {
            const trackedEntity = response.instances[0];
            if (!trackedEntity) {
                return Future.error(new Error(`Manager with ID ${id} not found`));
            }

            const managers = this.mapTrackedEntityToManager(trackedEntity);
            return Future.success(managers);
        });
    }

    private mapTrackedEntityToManager(trackedEntities: D2TrackerTrackedEntity): Manager {
        const { attributes, orgUnit, trackedEntity } = trackedEntities;

        // QUESTION: how to throw an error if any of these fields are missing?
        if (!attributes || !orgUnit || !trackedEntity) {
            throw new Error("Invalid tracked entity");
        }

        const name = getValueByAttributeIdFromAttributes(attributes, MANAGER_ATTRIBUTE_NAME_ID);
        const email = getValueByAttributeIdFromAttributes(attributes, MANAGER_ATTRIBUTE_EMAIL_ID);
        const userId = getValueByAttributeIdFromAttributes(attributes, MANAGER_ATTRIBUTE_USER_ID);

        // QUESTION: how to throw an error if any of these fields are missing?
        if (!name || !email || !userId) {
            throw new Error("Invalid manager attributes");
        }

        return {
            id: trackedEntity,
            name: name,
            email: email,
            userId: userId,
            orgUnitId: orgUnit,
        };
    }
}

const trackedEntityFields = {
    trackedEntity: true,
    attributes: true,
    orgUnit: true,
} as const;
