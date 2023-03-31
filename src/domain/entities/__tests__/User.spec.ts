import { User } from "../User";

const userNotAdmin = {
    id: 1,
    name: "Joellen de Banke",
    username: "jde0",
    userRoles: [{ id: "", name: "", authorities: ["Account Representative I"] }],
    userGroups: [],
    disabled: false,
};

const userAdmin = {
    id: 2,
    name: "Brigit Brewitt",
    username: "bbrewitt1",
    userRoles: [{ id: "", name: "", authorities: ["ALL"] }],
    userGroups: [],
    disabled: false,
};

function GivenANonAdminUser(): User {
    return new User(userNotAdmin);
}

function GivenANonAdminUserThatWasDisabledYesterday(): User {
    const user = new User(userNotAdmin);
    user.disable(getYesterdayDate());
    return user;
}

function GivenAnAdminUser(): User {
    return new User(userAdmin);
}

function getYesterdayDate(): Date {
    return new Date(Date.now() - 864e5);
}

function getTomorrowDate(): Date {
    return new Date(Date.now() + 864e5);
}

describe("User", () => {
    it("can be disabled if isn't admin", () => {
        //Given
        const user = GivenANonAdminUser();

        //Then
        user.disable();

        //When
        expect(user.isDisabled()).toBe(true);
    });
});

describe("User", () => {
    it("can't be disabled if it is admin", () => {
        //Given
        const adminUser = GivenAnAdminUser();

        //Then
        adminUser.disable();

        //When
        expect(adminUser.isDisabled()).toBe(false);
    });
});

describe("User", () => {
    it("can't be disabled if it is already disabled", () => {
        //Given
        const user = GivenANonAdminUserThatWasDisabledYesterday();

        //Then

        //When
        expect(user.disable()).toStrictEqual(getYesterdayDate());
    });
});

describe("User", () => {
    it("can't be disabled if given disable date is newer than current date", () => {
        //Given
        const user = GivenANonAdminUser();

        //Then

        //When
        try {
            user.disable(getTomorrowDate());
        } catch (error) {
            expect(error).toHaveProperty(
                "message",
                "Date when user was disabled can't be newer than the current date."
            );
        }
    });
});

describe("User", () => {
    it("should be admin when user role has an ALL authority", () => {
        //Given
        const adminUser = GivenAnAdminUser();

        //Then

        //When
        expect(adminUser.isAdmin()).toBe(true);
    });
});

describe("User", () => {
    it("shouldn't be admin when user role hasn't an ALL authority", () => {
        //Given
        const user = GivenANonAdminUser();

        //Then

        //When
        expect(user.isAdmin()).toBe(false);
    });
});

describe("User", () => {
    it("should return the days disabled being equal to 1 if date when disabled was yesterday", () => {
        //Given
        const user = GivenANonAdminUserThatWasDisabledYesterday();

        //Then

        //When
        expect(user.daysDisabled()).toEqual(1);
    });
});

// import { User, UserRole } from "../User";
// import { describe, expect, it } from "@jest/globals";
// import { NamedRef } from "../Ref";

// describe("User", () => {
//     it("should be admin if has a role with authority ALL", () => {
//         const user = createAdminUser();

//         expect(user.isAdmin()).toBe(true);
//     });
//     it("should no be admin if hasn't a role with authority ALL", () => {
//         const user = createNonAdminUser();

//         expect(user.isAdmin()).toBe(false);
//     });
//     it("should return belong to user group equal to false when the id exist", () => {
//         const userGroupId = "BwyMfDBLih9";

//         const user = createUserWithGroups([{ id: userGroupId, name: "Group 1" }]);

//         expect(user.belongToUserGroup(userGroupId)).toBe(true);
//     });
//     it("should return belong to user group equal to false when the id does not exist", () => {
//         const existedUserGroupId = "BwyMfDBLih9";
//         const nonExistedUserGroupId = "f31IM13BgwJ";

//         const user = createUserWithGroups([{ id: existedUserGroupId, name: "Group 1" }]);

//         expect(user.belongToUserGroup(nonExistedUserGroupId)).toBe(false);
//     });
//     it("should return belong to user group equal to false if user groups is empty", () => {
//         const nonExistedUserGroupId = "f31IM13BgwJ";

//         const user = createUserWithGroups();

//         expect(user.belongToUserGroup(nonExistedUserGroupId)).toBe(false);
//     });
// });

// function createAdminUser(): User {
//     const adminRoles = [{ id: "Hg7n0MwzUQn", name: "Super user", authorities: ["ALL"] }];

//     return createUser(adminRoles, []);
// }

// function createNonAdminUser(): User {
//     const nonAdminRoles = [{ id: "Hg7n0MwzUQn", name: "Malaria", authorities: ["F_EXPORT_DATA"] }];

//     return createUser(nonAdminRoles, []);
// }

// function createUserWithGroups(userGroups: NamedRef[] = []): User {
//     return new User({
//         id: "YjJdEO6d38H",
//         name: "Example test",
//         username: "example",
//         userRoles: [],
//         userGroups,
//     });
// }

// function createUser(userRoles: UserRole[], userGroups: NamedRef[] = []): User {
//     return new User({
//         id: "YjJdEO6d38H",
//         name: "Example test",
//         username: "example",
//         userRoles,
//         userGroups,
//     });
// }
