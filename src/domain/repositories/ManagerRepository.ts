import { Id } from "../entities/Ref";
import { FutureData } from "../../data/api-futures";
import { Manager } from "../entities/Manager";

export type GetManagerOptions = {
    Id?: Id;
    Ids?: Id[];
    name?: string;
    email?: string;
};

export interface ManagerRepository {
    get(options: GetManagerOptions): FutureData<Manager[]>;
    getById(id: Id): FutureData<Manager>;
}
