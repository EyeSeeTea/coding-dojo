import { NamedRef } from "./Ref";
import { UserRole, UserModel } from "./User";

const adminRole: UserRole = {
    id: "12345",
    name: "adminRole",
    authorities: ["ALL"],
};

const viewerRole: UserRole = {
    id: "12345",
    name: "viewerRole",
    authorities: ["VIEWER"],
};

const userGroup: NamedRef = {
    id: "4141414",
    name: "adminGroup",
};

const viewerGroup: NamedRef = {
    id: "4141414",
    name: "viewerGroup",
};

const adminUser = new UserModel({
    id: "1",
    name: "admin",
    username: "admin",
    userRoles: [adminRole],
    userGroups: [userGroup],
});

const viewerUser = new UserModel({
    id: "2",
    name: "viewer",
    username: "viewer",
    userRoles: [viewerRole],
    userGroups: [viewerGroup],
});

console.log("adminUser:", adminUser);

test("is admin user?", () => {
    expect(adminUser.isAdmin()).toBe(true);
    expect(viewerUser.isAdmin()).toBe(false);
});

test("try to disable admin & disable viewer user / check if user is disabled", () => {
    adminUser.disable();
    expect(adminUser.isDisabled()).toBe(false);

    viewerUser.disable();
    expect(viewerUser.isDisabled()).toBe(true);
});

test("disabled days count", () => {
    expect(viewerUser.getDisabledDaysCount()).toBeDefined();
    console.log("viewerUser disabled day count:", viewerUser.getDisabledDaysCount());
});

export {};
