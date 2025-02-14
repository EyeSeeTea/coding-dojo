import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { User } from "../entities/User";

export interface UserRepository {
    getCurrent(): FutureData<User>;
    getManager(managerId: Id): FutureData<User>;
}
