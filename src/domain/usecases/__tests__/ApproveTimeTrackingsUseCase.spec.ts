import { expectTypeOf } from "vitest";
import { ManagerTestRepository } from "../../../data/repositories/ManagerTestRepository";
import { NotificationTestRepository } from "../../../data/repositories/NotificationTestRepository";
import { NotApprovedTimeTrackingTestRepository } from "../../../data/repositories/TimeTrackingTestRepository";
import { ApproveTimeTrackingsUseCase } from "../ApproveTimeTrackingsUseCase";
import {
    createNonAdminUser,
    createUserWithApprovalPermissions,
} from "../../entities/__tests__/userFixtures";
import { Id } from "../../entities/Ref";

describe("ApproveTimeTrackingsUseCase", () => {
    it("allow approve time trackings if user has permission", async () => {
        const currentUser = createUserWithApprovalPermissions();
        const timeTrackingIdsToApprove: Id[] = ["1", "2"];

        const useCase = givenApproveTimeTrackingsUseCase();

        const response = useCase.execute(currentUser, timeTrackingIdsToApprove);

        const result = await response.toPromise();

        expectTypeOf(result).toEqualTypeOf<void>();
    });

    it("reject approve time trackings if user doesn't have permission", async () => {
        const currentUser = createNonAdminUser();
        const timeTrackingIdsToApprove: Id[] = ["1", "2"];

        currentUser.userRoles = [];

        const useCase = givenApproveTimeTrackingsUseCase();

        const response = useCase.execute(currentUser, timeTrackingIdsToApprove);

        await expect(response.toPromise()).rejects.toThrowError(
            "You don't have permission to approve time trackings"
        );
    });
});

function givenApproveTimeTrackingsUseCase() {
    return new ApproveTimeTrackingsUseCase({
        timeTrackingReposiory: new NotApprovedTimeTrackingTestRepository(),
        managerRepository: new ManagerTestRepository(),
        notificationRepository: new NotificationTestRepository(),
    });
}
