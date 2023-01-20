import { UserInstance, UserRoleInstance } from "./User";

export function getNewUser() {}
describe("findOrCreate method", () => {
    it("should disable not admin user and return date", async () => {
        const normalUser = getNormalUser();
        await normalUser.disableUser();

        expect(normalUser.disabled).toEqual(true);
        expect(normalUser.getDisabledDays()).toEqual(0);
    });
    it("should not disable admin user and return undefined date", async () => {
        const normalUser = getAdminUser();
        await normalUser.disableUser();

        expect(normalUser.disabled).toEqual(false);
        expect(normalUser.getDisabledDays()).toBeUndefined();
    });
});
function getAdminUser(): UserInstance {
    const adminRole = new UserRoleInstance("ADMIN", "UID3", ["ALL", "DASHBOARD_AUT", "CAPTURE_AUT"]);
    return new UserInstance("1", "Test User", "testuser", false, [adminRole], []);
}
function getNormalUser(): UserInstance {
    const dashRole = new UserRoleInstance("DASHBOARDS", "UID1", ["DASHBOARD_AUT"]);
    const captureRole = new UserRoleInstance("CAPTURE", "UID2", ["CAPTURE_AUT"]);
    return new UserInstance("1", "Test User", "testuser", false, [dashRole, captureRole], []);
}
