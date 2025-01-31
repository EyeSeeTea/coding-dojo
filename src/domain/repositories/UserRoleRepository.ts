import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { UserRole } from "../entities/User";

export interface UserRoleRepository {
    get(): FutureData<UserRole[]>;
    getById(id: Id): FutureData<UserRole>;
}
