import { TimeTracking } from "../../domain/entities/TimeTracking";
import { Future } from "../../domain/entities/generic/Future";
import {
    GetTimeTrackingOptions,
    Paginated,
    TimeTrackingRepository,
} from "../../domain/repositories/TimeTrackingRepository";
import { timeTrackingsData } from "../../fixtures/TimeTracking";
import { FutureData } from "../api-futures";

export class TimeTrackingTestRepository implements TimeTrackingRepository {
    get(options: GetTimeTrackingOptions): FutureData<Paginated<TimeTracking>> {
        return Future.success({
            data: timeTrackingsData,
            page: options.page,
            pageSize: options.pageSize,
            total: 1,
        });
    }

    getById(id: string): FutureData<TimeTracking> {
        const timeTracking = timeTrackingsData.find(timeTracking => timeTracking.id === id);
        if (!timeTracking) {
            return Future.error(new Error("Time tracking not found"));
        }
        return Future.success(timeTracking);
    }

    save(_timeTracking: TimeTracking): FutureData<void> {
        return Future.success(undefined);
    }
}
