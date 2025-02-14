import { Future } from "../../../domain/entities/generic/Future";
import { Id } from "../../../domain/entities/Ref";
import { TimeTrackingBaseAttrs, ApprovalStatuses } from "../../../domain/entities/TimeTracking";
import { TimeTrackingRepository } from "../../../domain/repositories/TimeTrackingRepository";
import { FutureData } from "../../api-futures";

export class TimeTrackingTestRepository implements TimeTrackingRepository {
    get(): FutureData<TimeTrackingBaseAttrs[]> {
        return Future.success([
            {
                id: "1",
                name: "Test Time Tracking 1",
                date: new Date("2021-01-01"),
                hours: 8,
                description: "Test Time Tracking 1 Description",
                approvalStatus: "PENDING",
                managerId: "M1",
            },
            {
                id: "2",
                name: "Test Time Tracking 2",
                date: new Date("2021-01-01"),
                hours: 8,
                description: "Test Time Tracking 2 Description",
                approvalStatus: "APPROVED",
                managerId: "M1",
            },
        ]);
    }
    getByManager(managerId: Id): FutureData<TimeTrackingBaseAttrs[]> {
        return Future.success([
            {
                id: "1",
                name: "Test Time Tracking 1",
                date: new Date("2021-01-01"),
                hours: 8,
                description: "Test Time Tracking 1 Description",
                approvalStatus: "PENDING",
                managerId: managerId,
            },
            {
                id: "2",
                name: "Test Time Tracking 2",
                date: new Date("2021-01-01"),
                hours: 8,
                description: "Test Time Tracking 2 Description",
                approvalStatus: "APPROVED",
                managerId: managerId,
            },
        ]);
    }
    getById(id: Id): FutureData<TimeTrackingBaseAttrs> {
        return Future.success({
            id: id,
            name: "Test Time Tracking 1",
            date: new Date("2021-01-01"),
            hours: 8,
            description: "Test Time Tracking 1 Description",
            approvalStatus: "PENDING",
            managerId: "M1",
        });
    }
    updateStatus(_id: Id, _status: ApprovalStatuses): FutureData<void> {
        return Future.success(undefined);
    }
}
