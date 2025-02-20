import { NotificationTestRepository } from "../../../data/repositories/NotificationTestRepository";
import { vi } from "vitest";
import { timeTrackingsData } from "../../../fixtures/TimeTracking";
import { ApproveTimeTrackingUseCase } from "../ApproveTimeTrackingUseCase";
import { UserTestRepository } from "../../../data/repositories/UserTestRepository";
import { TimeTrackingTestRepository } from "../../../data/repositories/TimeTrackingTestRepository";

const repositories = {
    notificationRepository: new NotificationTestRepository(),
    userRepository: new UserTestRepository(),
    timeTrackingRepository: new TimeTrackingTestRepository(),
};

const sendNotificationSpy = vi.spyOn(repositories.notificationRepository, "send");

describe("ApproveTimeTrackingUseCase", () => {
    it("approve time tracking", async () => {
        const usecase = new ApproveTimeTrackingUseCase(
            repositories.userRepository,
            repositories.timeTrackingRepository,
            repositories.notificationRepository
        );

        const timeTrackingTest = timeTrackingsData.find(
            timeTracking => timeTracking.status === "pending"
        );

        const res = usecase.execute(timeTrackingTest?.id ?? "");
        const timeTrackingResult = await res.toPromise();

        expect(timeTrackingResult.status).toEqual("approval");
        expect(sendNotificationSpy).toHaveBeenCalledWith({
            body: `Time tracking ${timeTrackingTest?.id} has been approved`,
            recipients: [timeTrackingTest?.managerId],
            title: "Time tracking approved",
        });
    });
});
