import { Maybe } from "../../utils/ts-utils";
import { Day } from "./Day";
import { Struct } from "./generic/Struct";
import { Id } from "./Ref";

type ManagerId = Id;

export type TimeRegistryAttrs = {
    id: Id;
    createdBy: ManagerId;
    reviewedBy: Maybe<ManagerId>;
    day: Day;
    hours: number;
    description: string;
    status: "PENDING" | "APPROVED";
    createdAt: Date;
    updatedAt: Date;
};

export class TimeRegistry extends Struct<TimeRegistryAttrs>() {
    approve(managerId: Id) {
        if (this.status !== "PENDING") {
            throw new Error("Only PENDING time registries can be reviewed");
        } else {
            return this._update({
                reviewedBy: managerId,
                status: "APPROVED",
                updatedAt: new Date(),
            });
        }
    }

    update(day: Day, hours: number, description: string) {
        if (this.status !== "PENDING") {
            throw new Error("Only PENDING time registries can be updated");
        } else {
            return this._update({
                day: day,
                hours: hours,
                description: description,
                updatedAt: new Date(),
            });
        }
    }
}
