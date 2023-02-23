import { NamedRef } from "./Ref";
import { UserRole, UserModel } from "./User";

describe("User", () => {
    test("is Admin", () => {
        const adminUser = GiveAnAdminUser();

        expect(adminUser.isAdmin()).toBe(true);
    });

    test("is not Admin", () => {
        const user = GiveAViewerUser();

        expect(user.isAdmin()).toBe(false);
    });

    test("can't be disabled if is Admin", () => {
        const adminUser = GiveAnAdminUser();

        adminUser.disable();

        expect(adminUser.isDisabled()).toBe(false);
    });

    test("can be disabled if is NOT Admin", () => {
        const user = GiveAViewerUser();

        user.disable();

        expect(user.isDisabled()).toBe(true);
    });

    test("(viewer) that is disabled should return disabled days count", () => {
        const user = GiveAViewerUser();

        user.disable(new Date("2023-02-18T03:24:00"));

        expect(user.getDisabledDaysCount()).toBeGreaterThanOrEqual(0);
    });

    test("(admin) that is disabled should return disabled days as undefined", () => {
        const user = GiveAnAdminUser();

        user.disable();

        expect(user.getDisabledDaysCount()).toBeUndefined();
    });

    test("disabledDate should return undefined when Admin", () => {
        const adminUser = GiveAnAdminUser();

        expect(adminUser.getDisabledDaysCount()).toBeUndefined();
    });

    test("disabledDate should return undefined when viewer user not disabled", () => {
        const user = GiveAViewerUser();

        expect(user.getDisabledDaysCount()).toBeUndefined();
    });
});

const GiveAnAdminUser = () => {
    const userGroup: NamedRef = {
        id: "4141414",
        name: "adminGroup",
    };

    const adminRole = {
        id: "12345",
        name: "adminRole",
        authorities: ["ALL"],
    };
    return new UserModel({
        id: "1",
        name: "admin",
        username: "admin",
        userRoles: [adminRole],
        userGroups: [userGroup],
    });
};

const GiveAViewerUser = () => {
    const viewerGroup: NamedRef = {
        id: "4141414",
        name: "viewerGroup",
    };
    const viewerRole: UserRole = {
        id: "12345",
        name: "viewerRole",
        authorities: ["VIEWER"],
    };
    return new UserModel({
        id: "2",
        name: "viewer",
        username: "viewer",
        userRoles: [viewerRole],
        userGroups: [viewerGroup],
    });
};

export {};
