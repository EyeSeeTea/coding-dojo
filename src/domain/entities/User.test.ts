import { User, UserProps } from "./User";
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
    it("should be admin if has authority ALL", () => {
        const user = makeUser(adminProps);

        expect(user.isAdmin()).toBe(true);
    });
    it("shouldn't be admin if hasn't authority ALL", () => {
        const user = makeUser(nonAdminProps);

        expect(user.isAdmin()).toBe(false);
    });
    it("shouldn't be disabled if disabled is undefined", () => {
        expect.assertions(2);
        const user = makeUser(nonAdminProps);

        expect(user.isDisabled()).toBe(false);
        expect(user.getDaysDisabled()).toBe(null);
    });
    it("shouldn't be disabled if disabled is false", () => {
        expect.assertions(2);
        nonAdminProps.disabled = false;

        const user = makeUser(nonAdminProps);

        expect(user.isDisabled()).toBe(false);
        expect(user.getDaysDisabled()).toBe(null);
    });
    it("should be disabled if disabled is true and not admin", () => {
        expect.assertions(2);
        nonAdminProps.disabled = true;

        const user = makeUser(nonAdminProps);

        expect(user.isDisabled()).toBe(true);
        expect(user.getDaysDisabled()).toBe(0);
    });
    it("disabled timestamp should be older than present", () => {
        jest.useFakeTimers().setSystemTime(new Date("2023-01-01"));
        nonAdminProps.disabled = true;
        try {
            makeUser(nonAdminProps);
        } catch (error) {
            expect(error).toHaveProperty("message", "Time travel not yet possible");
        }
    });
    it("should fail if disabled is true and admin", () => {
        adminProps.disabled = true;
        try {
            makeUser(adminProps);
        } catch (error) {
            expect(error).toHaveProperty("message", "Admins users can't be disabled");
        }
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
