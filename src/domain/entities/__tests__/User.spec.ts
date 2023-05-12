import { User } from "../User";
import { describe, expect, it } from "@jest/globals";
import { UserGroup, UserGroupData } from "../UserGroup";
import { Authority, UserRole, UserRoleData } from "../UserRole";

describe("User", () => {
    it("should be admin if has a role with authority ALL+Import Metadata and belongs to Administrators group and is enabled", () => {
        const user = createAdminUser();
        expect(user.isAdmin()).toBe(true);
    });

    it("should not be admin if has partial authority", () => {
        const user = createPartialAuthorityUser();
        expect(user.isAdmin()).toBe(false);
    });

    it("should not be admin if does not belong to Administrators group", () => {
        const user = createNonAdminGroupUser();

        expect(user.isAdmin()).toBe(false);
    });

    it("should not be admin if is disabled", () => {
        const user = createDisabledUser();

        expect(user.isAdmin()).toBe(false);
    });
});

function createAdminUser(): User {
    const adminRoles = [
        { id: "Hg7n0MwzUQn", name: "Super user", authorities: ["superadmin", "import"] as Authority[] },
    ];
    const adminGroups = [{ id: "1", name: "Administrators" }];

    return createUser(adminRoles, adminGroups, false);
}

function createPartialAuthorityUser(): User {
    const partialAdminRoles = [{ id: "Hg7n0MwzUQn", name: "Super user", authorities: ["superadmin"] as Authority[] }];
    const adminGroups = [{ id: "1", name: "Administrators" }];

    return createUser(partialAdminRoles, adminGroups, false);
}

function createDisabledUser(): User {
    const adminRoles = [
        { id: "Hg7n0MwzUQn", name: "Super user", authorities: ["superadmin", "import"] as Authority[] },
    ];
    const adminGroups = [{ id: "1", name: "Administrators" }];

    return createUser(adminRoles, adminGroups, true);
}

function createNonAdminGroupUser(): User {
    const adminRoles = [
        { id: "Hg7n0MwzUQn", name: "Super user", authorities: ["superadmin", "import"] as Authority[] },
    ];
    const nonAdminGroups = [{ id: "1", name: "Non-Administrators" }];

    return createUser(adminRoles, nonAdminGroups, false);
}

function createUser(userRolesAttr: UserRoleData[], userGroupsAttr: UserGroupData[], isDisabled: boolean): User {
    return new User({
        id: "YjJdEO6d38H",
        name: "Example test",
        username: "example",
        userRoles: userRolesAttr.map(userRoleAttr => new UserRole(userRoleAttr)),
        userGroups: userGroupsAttr.map(userGroupsAttr => new UserGroup(userGroupsAttr)),
        isDisabled: isDisabled,
    });
}
