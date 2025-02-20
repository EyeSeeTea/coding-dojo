import { User } from "../../domain/entities/User";
import { Future } from "../../domain/entities/generic/Future";
import { UserRepository } from "../../domain/repositories/UserRepository";
import { D2Api, MetadataPick } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";

export class UserD2Repository implements UserRepository {
    constructor(private api: D2Api) {}
    getByIds(_ids: string[]): FutureData<User[]> {
        return Future.success([]);
    }

    public getCurrent(): FutureData<User> {
        return apiToFuture(
            this.api.currentUser.get({
                fields: userFields,
            })
        ).map(d2User => {
            const res = this.buildUser(d2User);
            return res;
        });
    }

    private buildUser(d2User: D2User) {
        return new User({
            id: d2User.id,
            name: d2User.displayName,
            userGroups: d2User.userGroups,
            ...d2User.userCredentials,
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
    },
} as const;

type D2User = MetadataPick<{ users: { fields: typeof userFields } }>["users"][number];
