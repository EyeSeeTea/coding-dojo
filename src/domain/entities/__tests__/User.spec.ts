import { User } from "../User";
import { describe, expect, it } from "@jest/globals";
import { UserRole } from "../UserRole";
import { UserGroup } from "../UserGroup";

describe("User", () => {
    it("should be admin if has a role with authorities ALL and F_METADATA_IMPORT, belongs to group Administrator and is not disabled", () => {
        const user = createAdminUser();

        expect(user.isAdmin()).toBe(true);
    });

    it("should no be admin if hasn't a role with authority ALL and F_METADATA_IMPORT, does not belong to administrators or is disabled", () => {
        const user = createNonAdminUser();

        expect(user.isAdmin()).toBe(false);
    });

    it("should return belong to user group equal to false when the id exist", () => {
        const userGroupId = "BwyMfDBLih9";

        const user = createUserWithGroups([createUserGroup(userGroupId, "Group 1")]);

        expect(user.belongToUserGroup(userGroupId)).toBe(true);
    });

    it("should return belong to user group equal to false when the id does not exist", () => {
        const existedUserGroupId = "BwyMfDBLih9";
        const nonExistedUserGroupId = "f31IM13BgwJ";

        const user = createUserWithGroups([createUserGroup(existedUserGroupId, "Group 1")]);

        expect(user.belongToUserGroup(nonExistedUserGroupId)).toBe(false);
    });

    it("should return belong to user group equal to false if user groups is empty", () => {
        const nonExistedUserGroupId = "f31IM13BgwJ";

        const user = createUserWithGroups();

        expect(user.belongToUserGroup(nonExistedUserGroupId)).toBe(false);
    });
});

function createAdminUser(): User {
    const adminRoles = [
        { id: "Hg7n0MwzUQn", name: "Super user", authorities: ["ALL"] },
        { id: "AciW92in2kk", name: "Metadata user", authorities: ["F_METADATA_IMPORT"] },
    ];

    return createUser(adminRoles, [createUserGroup("wl5cDMuUhmF", "Administrators")], false);
}

function createNonAdminUser(): User {
    const nonAdminRoles = [{ id: "Hg7n0MwzUQn", name: "Malaria", authorities: ["ALL"] }];

    return createUser(nonAdminRoles, [], true);
}

function createUserWithGroups(userGroups: UserGroup[] = []): User {
    return new User({
        id: "YjJdEO6d38H",
        name: "Example test",
        username: "example",
        userRoles: [],
        userGroups,
        isDisabled: false,
    });
}

function createUser(userRoles: UserRole[], userGroups: UserGroup[] = [], isDisabled = false): User {
    return new User({
        id: "YjJdEO6d38H",
        name: "Example test",
        username: "example",
        userRoles,
        userGroups,
        isDisabled,
    });
}

function createUserGroup(id: string, name: string) {
    return new UserGroup({ id, name });
}
