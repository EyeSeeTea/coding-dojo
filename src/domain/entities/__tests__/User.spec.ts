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
