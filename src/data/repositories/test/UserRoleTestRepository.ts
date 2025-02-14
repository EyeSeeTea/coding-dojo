import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import { UserRole } from "../../../domain/entities/User";
import { UserRoleRepository } from "../../../domain/repositories/UserRoleRepository";
import { FutureData } from "../../api-futures";

export class UserRoleTestRepository implements UserRoleRepository {
    get(): FutureData<UserRole[]> {
        return Future.success([
            {
                id: "1",
                name: "Admin",
                authorities: ["ALL"],
            },
            {
                id: "2",
                name: "Manager",
                authorities: ["MANAGER"],
            },
            {
                id: "3",
                name: "User",
                authorities: [],
            },
        ]);
    }
    getById(id: Id): FutureData<UserRole> {
        return Future.success({
            id: id,
            name: "Admin",
            authorities: ["ALL"],
        });
    }
}
