import { Id } from "./Ref";
import { FutureData } from "../../data/api-futures";
import { TimeRecordStatus } from "./TimeRecord";

export type Manager = {
    id: Id;
    firstName: string;
    lastName: string;
    email: string;
};

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
