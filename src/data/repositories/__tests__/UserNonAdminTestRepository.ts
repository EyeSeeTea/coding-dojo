import { User } from "../../../domain/entities/User";
import { createNonAdminUser } from "../../../domain/entities/__tests__/userFixtures";
import { Future } from "../../../domain/entities/generic/Future";
import { UserRepository } from "../../../domain/repositories/UserRepository";
import { FutureData } from "../../api-futures";

export class UserNonAdminTestRepository implements UserRepository {
    public getCurrent(): FutureData<User> {
        return Future.success(createNonAdminUser());
    }
}
