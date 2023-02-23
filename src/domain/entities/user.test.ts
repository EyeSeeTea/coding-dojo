import { UserInstance, UserRoleInstance } from "./User";

export function getNewUser() {}
describe("findOrCreate method", () => {
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

    it("should return a date when a normal user is disabled", async () => {
        //given
        const normalUser = getNormalUser();

        //when
        await normalUser.disableUser();

        //then
        expect(normalUser.getDisabledDays()).toEqual(0);
    });

    it("should return undefined when a normal user is not disabled", async () => {
        //given
        const normalUser = getNormalUser();

        //then
        expect(normalUser.getDisabledDays()).toBeUndefined();
    });

    it("should return date undefined when disableUser is called for a admin user", async () => {
        //given
        const normalUser = getAdminUser();

        await normalUser.disableUser();
        //then
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
