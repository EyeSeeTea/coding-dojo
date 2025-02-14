import { givenTimeTrackings } from "../../domain/entities/__tests__/timeTrackingFixtures";
import { Future } from "../../domain/entities/generic/Future";
import { TimeTracking } from "../../domain/entities/TimeTracking";
import {
    TimeTrackingRepository,
    TimeTrackingFilters,
} from "../../domain/repositories/TimeTrackingRepository";
import { FutureData } from "../api-futures";

export class NotApprovedTimeTrackingTestRepository implements TimeTrackingRepository {
    get(filters?: TimeTrackingFilters): FutureData<TimeTracking[]> {
        return Future.success(givenTimeTrackings(filters?.timeTrackingIds?.length ?? 5, false));
    }

    save(_timeTrackings: TimeTracking[]): FutureData<void> {
        return Future.success(undefined);
    }
}

export class ApprovedTimeTrackingTestRepository implements TimeTrackingRepository {
    get(filters?: TimeTrackingFilters): FutureData<TimeTracking[]> {
        return Future.success(givenTimeTrackings(filters?.timeTrackingIds?.length ?? 5, true));
    }

    save(_timeTrackings: TimeTracking[]): FutureData<void> {
        return Future.success(undefined);
    }
}
