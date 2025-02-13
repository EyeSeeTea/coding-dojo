import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";
import { GetManagerOptions, ManagerRepository } from "../../domain/repositories/ManagerRepository";
import { Manager } from "../../domain/entities/Manager";
import { arrayToObject } from "../../utils/ts-utils";
import { D2TrackerTrackedEntity } from "@eyeseetea/d2-api/api/trackerTrackedEntities";

export const timeTrackerProgram = "tCLYCylAuin";
// const trackedEntityType = "ngoDXhRbmIv";
const firstName = "nma3GGra27F";
const lastName = "SeIvCxIkJdq";
const email = "IvnPSzlsbyg";

export class ManagerD2Repository implements ManagerRepository {
    constructor(private api: D2Api) {}

    get(options: GetManagerOptions): FutureData<Manager[]> {
        return apiToFuture(
            this.api.tracker.trackedEntities.get({
                trackedEntity: options.Ids?.join(";"),
                fields: {
                    trackedEntity: true,
                    attributes: {
                        attribute: true,
                        valueType: true,
                        value: true,
                    },
                },
                filter: buildTrackerEntityFilter(options),
                program: timeTrackerProgram,
                enrollmentEnrolledBefore: new Date().toISOString(),
                pageSize: 100,
            })
        ).map(response => {
            return response.instances.map(mapTrackedEntityToManager);
        });
    }
}

function buildTrackerEntityFilter(options: GetManagerOptions): string {
    const splitName = options.name?.split(" ") || [];
    const nameFilter = splitName.reduce((acc, name) => {
        return `${acc},${firstName}:like:${name},${lastName}:like:${name},`;
    }, "");
    const emailFilter = options.email ? `email:like:${options.email},` : "";
    return `${nameFilter}${emailFilter}`;
}

function mapTrackedEntityToManager(trackedEntity: D2TrackerTrackedEntity): Manager {
    const attributes =
        trackedEntity.attributes && arrayToObject(trackedEntity.attributes, "attribute");
    return {
        id: trackedEntity.trackedEntity || "No id",
        firstName: attributes?.[firstName]?.value || "No first name",
        lastName: attributes?.[lastName]?.value || "No last name",
        email: attributes?.[email]?.value || "No email",
    } as Manager;
}
