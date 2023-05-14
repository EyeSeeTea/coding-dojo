import _ from "lodash";
import { FutureData } from "../../domain/entities/Future";
import { User } from "../../domain/entities/User";
import { UserGroup } from "../../domain/entities/UserGroup";
import { Authority, UserRole } from "../../domain/entities/UserRole";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture } from "../../utils/futures";

export class UserD2Repository implements UserRepository {
    constructor(private api: D2Api) {}

    public getCurrent(): FutureData<User> {
        return apiToFuture(
            this.api.currentUser.get({
                fields: userFields,
            })
        ).map(d2User => this.buildUser(d2User));
    }

    private buildUser(d2User: D2User) {
        return new User({
            id: d2User.id,
            name: d2User.displayName,
            userGroups: d2User.userGroups.map(d2UserGroup => new UserGroup(d2UserGroup)),
            userRoles: d2User.userCredentials.userRoles.map((d2UserRole): UserRole => {
                const mapping: Record<string, Authority> = {
                    ALL: "superadmin",
                    F_METADATA_IMPORT: "import",
                };
                const authorities = _(d2UserRole.authorities)
                    .map(d2Authority => mapping[d2Authority])
                    .compact()
                    .value();

                return new UserRole({ id: d2UserRole.id, name: d2UserRole.name, authorities });
            }),
            username: d2User.userCredentials.username,
            isDisabled: d2User.userCredentials.disabled,
        });
    }
}

const userFields = {
    id: true,
    displayName: true,
    userGroups: { id: true, name: true },
    userCredentials: {
        username: true,
        userRoles: { id: true, name: true, authorities: true },
        disabled: true,
    },
} as const;

type D2User = MetadataPick<{ users: { fields: typeof userFields } }>["users"][number];
