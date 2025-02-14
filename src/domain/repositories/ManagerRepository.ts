import { FutureData } from "../../data/api-futures";
import { Manager } from "../entities/Manager";
import { Id } from "../entities/Ref";

export type ManagerFilters = {
    managerIds?: Id[];
};

export interface ManagerRepository {
    get(filters?: ManagerFilters): FutureData<Manager[]>;
    getById(id: Id): FutureData<Manager>;
}
