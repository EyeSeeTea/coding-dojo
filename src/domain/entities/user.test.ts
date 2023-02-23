import { UserInstance, UserRoleInstance } from "./User";

export function getNewUser() {}
describe("User", () => {
    it("should be admin if have been created with the role authority all", async () => {
        //given
        const normalUser = getAdminUser();

        //then
        expect(normalUser.isAdmin()).toEqual(true);
    });

    it("should not be admin if have been created with the role authority all", async () => {
        //given
        const normalUser = getNormalUser();

        //then
        expect(normalUser.isAdmin()).toEqual(false);
    });

    it("should disable normal user when disableUser is called", async () => {
        //given
        const normalUser = getNormalUser();

        //when
        await normalUser.disableUser();

        //then
        expect(normalUser.disabled).toEqual(true);
    });

    it("should not disable admin user when disableUser is called", async () => {
        //given
        const normalUser = getAdminUser();

        //when
        await normalUser.disableUser();

        //then
        expect(normalUser.disabled).toEqual(false);
    });

    it("should return the disabled days when a normal user is disabled", async () => {
        //given
        const normalUser = getNormalUser();

        //when
        await normalUser.disableUser();

        //then
        expect(normalUser.getDisabledDays()).toEqual(0);
    });

    it("should return date undefined when disableUser is called for a admin user", async () => {
        //given
        const normalUser = getAdminUser();

        await normalUser.disableUser();
        //then
        expect(normalUser.getDisabledDays()).toBeUndefined();
    });

    it("should return undefined when a normal user is not disabled", async () => {
        //given
        const normalUser = getNormalUser();

        //then
        expect(normalUser.getDisabledDays()).toBeUndefined();
    });

    it("should return undefined when a admin user is not disabled", async () => {
        //given
        const normalUser = getAdminUser();

        //then
        expect(normalUser.getDisabledDays()).toBeUndefined();
    });

    it("should return 5 days when a normal user was disabled after 5 days", async () => {
        //given
        const normalUser = getNormalUser();
        //when
        const disabledDate: Date = new Date(new Date().setDate(new Date().getDate() - 5));
        normalUser.disableUser(disabledDate);
        //then
        expect(normalUser.getDisabledDays()).toEqual(5);
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
