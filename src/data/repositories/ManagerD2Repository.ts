import { D2Api } from "@eyeseetea/d2-api/2.36";
import { ManagerRepository } from "../../domain/repositories/ManagerRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { Manager } from "../../domain/entities/Manager";
import { Future } from "../../domain/entities/generic/Future";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";
import {
    MANAGER_TRACKER_PROGRAM_ID,
    TIME_TRACKING_ORG_UNIT_ID,
} from "../consts/TimeTrackingConstants";

export class ManagerD2Repository implements ManagerRepository {
    constructor(private api: D2Api) {}

    getById(id: string): FutureData<Manager> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                program: MANAGER_TRACKER_PROGRAM_ID,
                orgUnit: TIME_TRACKING_ORG_UNIT_ID,
                trackedEntity: id,
                fields: { trackedEntity: true, attributes: true },
            })
        ).flatMap(d2ManagerResponse => {
            const managerTrackedEntity = d2ManagerResponse.instances[0];

            if (!managerTrackedEntity) return Future.error(new Error("Manager not found."));
            else return this.buildManager(managerTrackedEntity);
        });
    }

    private buildManager(d2Manager: D2TrackerTrackedEntity): FutureData<Manager> {
        const { trackedEntity, attributes } = d2Manager;

        const name = attributes?.find(attribute => attribute.attribute === MANAGER_NAME_TEA)?.value;
        const email = attributes?.find(
            attribute => attribute.attribute === MANAGER_EMAIL_TEA
        )?.value;

        if (!trackedEntity || !name || !email)
            return Future.error(new Error("Manager data is incomplete."));

        return Future.success(
            new Manager({
                id: trackedEntity,
                name: name,
                email: email,
            })
        );
    }
}

const MANAGER_NAME_TEA = "MANAGER_NAME_TEA";
const MANAGER_EMAIL_TEA = "MANAGER_EMAIL_TEA";
