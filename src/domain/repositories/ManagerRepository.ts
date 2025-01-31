import { FutureData } from "../../data/api-futures";
import { Manager } from "../entities/Manager";
import { Id } from "../entities/Ref";

export interface ManagerRepository {
    getById(id: Id): FutureData<Manager>;
    getByIds(ids: Id[]): FutureData<Manager[]>;
}
