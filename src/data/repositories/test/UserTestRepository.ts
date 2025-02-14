import { createAdminUser, createManager } from "../../../domain/entities/__tests__/userFixtures";
import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { FutureData } from "../../api-futures";

export class UserTestRepository implements UserRepository {
    getManager(_managerId: Id): FutureData<User> {
        return Future.success(createManager());
    }
    public getCurrent(): FutureData<User> {
        return Future.success(createAdminUser());
    }
}
