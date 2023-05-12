import { FutureData } from "../../domain/entities/Future";
import { User } from "../../domain/entities/User";
import { UserGroup } from "../../domain/entities/UserGroup";
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
            userGroups: d2User.userGroups.map(ug => new UserGroup(ug)),
            isDisabled: d2User.userCredentials.disabled,
            ...d2User.userCredentials,
        });
    }
}

const userFields = {
    id: true,
    displayName: true,
    userGroups: { id: true, name: true },
    userCredentials: {
        disabled: true,
        username: true,
        userRoles: { id: true, name: true, authorities: true },
    },
} as const;

type D2User = MetadataPick<{ users: { fields: typeof userFields } }>["users"][number];
