import { User, UserRole } from "../User";
import { describe, expect, it } from "@jest/globals";
import { NamedRef } from "../Ref";

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

    // it("should return belong to user group equal to false when the id exist", () => {
    //     const userGroupId = "BwyMfDBLih9";

    //     const user = createUserWithGroups([{ id: userGroupId, name: "Group 1" }]);

    //     expect(user.belongToUserGroup(userGroupId)).toBe(true);
    // });
    // it("should return belong to user group equal to false when the id does not exist", () => {
    //     const existedUserGroupId = "BwyMfDBLih9";
    //     const nonExistedUserGroupId = "f31IM13BgwJ";

    //     const user = createUserWithGroups([{ id: existedUserGroupId, name: "Group 1" }]);

    //     expect(user.belongToUserGroup(nonExistedUserGroupId)).toBe(false);
    // });
    // it("should return belong to user group equal to false if user groups is empty", () => {
    //     const nonExistedUserGroupId = "f31IM13BgwJ";

    //     const user = createUserWithGroups();

    //     expect(user.belongToUserGroup(nonExistedUserGroupId)).toBe(false);
    // });
});

function createAdminUser(): User {
    const adminRoles = [{ id: "Hg7n0MwzUQn", name: "Super user", authorities: ["ALL", "F_METADATA_IMPORT"] }];
    const adminGroups = [{ id: "1", name: "Administrators" }];

    return createUser(adminRoles, adminGroups, false);
}

function createPartialAuthorityUser(): User {
    const partialAdminRoles = [{ id: "Hg7n0MwzUQn", name: "Super user", authorities: ["ALL"] }];
    const adminGroups = [{ id: "1", name: "Administrators" }];

    return createUser(partialAdminRoles, adminGroups, false);
}

function createDisabledUser(): User {
    const adminRoles = [{ id: "Hg7n0MwzUQn", name: "Super user", authorities: ["ALL", "F_METADATA_IMPORT"] }];
    const adminGroups = [{ id: "1", name: "Administrators" }];

    return createUser(adminRoles, adminGroups, true);
}

function createNonAdminGroupUser(): User {
    const adminRoles = [{ id: "Hg7n0MwzUQn", name: "Super user", authorities: ["ALL", "F_METADATA_IMPORT"] }];
    const nonAdminGroups = [{ id: "1", name: "Non-Administrators" }];

    return createUser(adminRoles, nonAdminGroups, false);
}

function createUser(userRoles: UserRole[], userGroups: NamedRef[] = [], isDisabled: boolean): User {
    return new User({
        id: "YjJdEO6d38H",
        name: "Example test",
        username: "example",
        userRoles,
        userGroups,
        isDisabled: isDisabled,
    });
}

// function createUserWithGroups(userGroups: NamedRef[] = []): User {
//     return new User({
//         id: "YjJdEO6d38H",
//         name: "Example test",
//         username: "example",
//         userRoles: [],
//         userGroups,
//         isDisabled: false,
//     });
// }
