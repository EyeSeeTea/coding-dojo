import { User, UserProps } from "../User";
import { describe, expect, it } from "@jest/globals";

const nonAdminProps: UserProps = {
    id: "AAAAAAAAAA1",
    name: "name",
    username: "username",
    userRoles: [{ id: "AAAAAAAAAA1", name: "not_admin", authorities: ["NOT_ALL"] }],
    userGroups: [],
    disabled: undefined,
};

const adminProps: UserProps = {
    id: "AAAAAAAAAA1",
    name: "name",
    username: "username",
    userRoles: [{ id: "AAAAAAAAAA1", name: "admin", authorities: ["ALL"] }],
    userGroups: [],
    disabled: undefined,
};

describe("User", () => {
    // make user
    it("should be admin if has authority ALL", () => {
        const user = makeUser(adminProps);

        expect(user.isAdmin()).toBe(true);
    });

    it("shouldn't be admin if hasn't authority ALL", () => {
        const user = makeUser(nonAdminProps);

        expect(user.isAdmin()).toBe(false);
    });

    // make user - disabled
    it("creation should not fail if is disabled and is admin", () => {
        adminProps.disabled = false;

        const test = () => {
            makeUser(adminProps);
        };

        expect(test).not.toThrow("Admins users can't be disabled");
    });

    it("should fail if disabled is true and admin", () => {
        adminProps.disabled = true;

        const test = () => {
            makeUser(adminProps);
        };

        expect(test).toThrow("Admins users can't be disabled");
    });

    it("shouldn't be disabled if disabled is undefined", () => {
        expect.assertions(2);
        const user = makeUser(nonAdminProps);

        expect(user.isDisabled()).toBe(false);
        expect(user.getDaysDisabled()).toBe(undefined);
    });

    it("shouldn't be disabled if disabled is false", () => {
        expect.assertions(2);
        nonAdminProps.disabled = false;

        const user = makeUser(nonAdminProps);

        expect(user.isDisabled()).toBe(false);
        expect(user.getDaysDisabled()).toBe(undefined);
    });

    it("should be disabled if disabled is true and not admin", () => {
        expect.assertions(2);
        nonAdminProps.disabled = true;

        const user = makeUser(nonAdminProps);

        expect(user.isDisabled()).toBe(true);
        expect(user.getDaysDisabled()).toBe(0);
    });

    // timestamp
    it("should be disabled and the timestamp be unaltered if user already disabled and not admin", () => {
        jest.useFakeTimers().setSystemTime(new Date("2023-01-01"));
        nonAdminProps.disabled = true;

        const user = makeUser(nonAdminProps);
        user.setDisabled(true);

        expect(user.getDaysDisabled()).toBe(0);
    });

    it("that is disabled should have an accuarate timestamp", () => {
        jest.useFakeTimers().setSystemTime(new Date("2023-03-29"));
        nonAdminProps.disabled = true;

        const user = makeUser(nonAdminProps);
        jest.useRealTimers();

        expect(user.getDaysDisabled()).toBe(2);
    });

    it("disabled timestamp should be older than present", () => {
        jest.useFakeTimers().setSystemTime(new Date("2040-01-01"));
        nonAdminProps.disabled = true;

        const user = makeUser(nonAdminProps);
        jest.useRealTimers();
        const test = () => {
            user.getDaysDisabled();
        };

        expect(test).toThrow("disabledTimestamp is newer than present");
    });
});

function makeUser(props: UserProps): User {
    return new User({
        id: props.id,
        name: props.name,
        username: props.username,
        userRoles: props.userRoles,
        userGroups: props.userGroups,
        disabled: props.disabled,
    });
}
