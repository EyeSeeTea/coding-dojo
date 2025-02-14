import { D2Api } from "@eyeseetea/d2-api/2.36";
import { Id } from "../../domain/entities/Ref";
import { UserRole } from "../../domain/entities/User";
import { UserRoleRepository } from "../../domain/repositories/UserRoleRepository";
import { apiToFuture, FutureData } from "../api-futures";
import { Future } from "../../domain/entities/generic/Future";

export class UserRoleD2Repository implements UserRoleRepository {
    constructor(private api: D2Api) {}

    get(): FutureData<UserRole[]> {
        return apiToFuture(
            this.api.models.userRoles
                .get({ fields: { id: true, name: true, authorities: true } })
                .map(response => {
                    return response.data.objects.map(({ id, name, authorities }) => {
                        return {
                            id,
                            name,
                            authorities,
                        };
                    });
                })
        );
    }
    getById(id: Id): FutureData<UserRole> {
        return apiToFuture(
            this.api.models.userRoles.get({
                fields: { id: true, name: true, authorities: true },
                filter: { id: { eq: id } },
            })
        ).flatMap(response => {
            const userRole = response.objects[0];
            if (!userRole) {
                return Future.error(new Error(`User role with id ${id} not found`));
            }
            return Future.success({
                id: userRole.id,
                name: userRole.name,
                authorities: userRole.authorities,
            });
        });
    }
}
