import { User, UserRole } from "../User";
import { describe, expect, it } from "@jest/globals";
import { NamedRef } from "../Ref";

describe("User", () => {
    it("should be admin if has a role with authority ALL and F_METADATA_IMPORT and is in the Administrators user group", () => {
        const user = createAdminUser();

        expect(user.isAdmin()).toBe(true);
    });
    it("should no be admin if hasn't a role with authority ALL", () => {
        const user = createNonAdminUser();

        expect(user.isAdmin()).toBe(false);
    });
    it("should return belong to user group equal to false when the id exist", () => {
        const userGroupId = "BwyMfDBLih9";

        const user = createUserWithGroups([{ id: userGroupId, name: "Group 1" }]);

        expect(user.belongToUserGroup(userGroupId)).toBe(true);
    });
    it("should return belong to user group equal to false when the id does not exist", () => {
        const existedUserGroupId = "BwyMfDBLih9";
        const nonExistedUserGroupId = "f31IM13BgwJ";

        const user = createUserWithGroups([{ id: existedUserGroupId, name: "Group 1" }]);

        expect(user.belongToUserGroup(nonExistedUserGroupId)).toBe(false);
    });
    it("should return belong to user group equal to false if user groups is empty", () => {
        const nonExistedUserGroupId = "f31IM13BgwJ";

        const user = createUserWithGroups();

        expect(user.belongToUserGroup(nonExistedUserGroupId)).toBe(false);
    });
});

function createAdminUser(): User {
    const adminRoles = [{ id: "Hg7n0MwzUQn", name: "Super user", authorities: ["ALL", "F_METADATA_IMPORT"] }];
    const adminGroups = [{ id: "wl5cDMuUhmF", name: "Administrators" }];

    return createUser(adminRoles, adminGroups);
}

function createNonAdminUser(): User {
    const nonAdminRoles = [{ id: "Hg7n0MwzUQn", name: "Malaria", authorities: ["F_EXPORT_DATA"] }];

    return createUser(nonAdminRoles, []);
}

function createUserWithGroups(userGroups: NamedRef[] = []): User {
    return new User({
        id: "YjJdEO6d38H",
        name: "Example test",
        username: "example",
        userRoles: [],
        userGroups,
        isDisabled: false,
    });
}

function createUser(userRoles: UserRole[], userGroups: NamedRef[] = []): User {
    return new User({
        id: "YjJdEO6d38H",
        name: "Example test",
        username: "example",
        userRoles,
        userGroups,
        isDisabled: false,
    });
}
