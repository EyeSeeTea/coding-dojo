import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Manager } from "../entities/Manager";
import { Id } from "../entities/Ref";

export interface ManagerRepository {
    getById(managerId: Id): FutureData<Maybe<Manager>>;
}
