import { User } from "../User";
import { describe, expect, it } from "@jest/globals";
import { UserGroup, UserGroupData } from "../UserGroup";
import { Authority, UserRole, UserRoleData } from "../UserRole";

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

        const userGroup = new UserGroup({ id: userGroupId, name: "Group 1" });
        const user = createUserWithGroups([userGroup]);

        expect(user.belongToUserGroup(userGroupId)).toBe(true);
    });
    it("should return belong to user group equal to false when the id does not exist", () => {
        const existedUserGroupId = "BwyMfDBLih9";
        const nonExistedUserGroupId = "f31IM13BgwJ";

        const userGroup = new UserGroup({ id: existedUserGroupId, name: "Group 1" });
        const user = createUserWithGroups([userGroup]);

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
        { id: "Hg7n0MwzUQn", name: "Super user", authorities: ["superadmin"] as Authority[] },
        { id: "AciW92in2kk", name: "Metadata user", authorities: ["import"] as Authority[] },
    ];
    const adminGroups = new UserGroup({ id: "wl5cDMuUhmF", name: "Administrators" });

    return createUser(adminRoles, [adminGroups]);
}

function createNonAdminUser(): User {
    const nonAdminRoles = [{ id: "Hg7n0MwzUQn", name: "Malaria", authorities: [] as Authority[] }];

    return createUser(nonAdminRoles, []);
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

function createUser(userRoleAttrs: UserRoleData[], userGroupAttrs: UserGroupData[] = []): User {
    return new User({
        id: "YjJdEO6d38H",
        name: "Example test",
        username: "example",
        userRoles: userRoleAttrs.map(userRoleAttr => new UserRole(userRoleAttr)),
        userGroups: userGroupAttrs.map(userGroupAttr => new UserGroup(userGroupAttr)),
        isDisabled: false,
    });
}
