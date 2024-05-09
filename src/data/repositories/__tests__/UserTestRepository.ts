import { User } from "../../../domain/entities/User";
import {
    createAdminUser,
    createNonAdminUser,
} from "../../../domain/entities/__tests__/userFixtures";
import { Future } from "../../../domain/entities/generic/Future";
import { FutureData } from "../../api-futures";

export class UserTestRepository {
    constructor(private isAdmin?: boolean) {}

    public getCurrent(): FutureData<User> {
        return Future.success(this.isAdmin ? createAdminUser() : createNonAdminUser());
    }
}
