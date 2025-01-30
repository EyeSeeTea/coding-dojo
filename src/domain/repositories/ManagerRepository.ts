import { FutureData } from "../../data/api-futures";
import { Maybe } from "../../utils/ts-utils";
import { Manager } from "../entities/Manager";

export interface ManagerRepository {
    getById(id: string): FutureData<Maybe<Manager>>;
}
