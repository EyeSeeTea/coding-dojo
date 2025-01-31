import { FutureData } from "../../data/api-futures";
import { Day } from "../entities/Day";
import { TimeEntry, TimeEntryApprovalStatus } from "../entities/TimeEntry";
import { User } from "../entities/User";

export interface GetTimeEntriesFilters {
    manager?: User;
    status?: TimeEntryApprovalStatus;
    from?: Day;
    to?: Day;
}

export interface TimeEntryRepository {
    get(options?: GetTimeEntriesFilters): FutureData<TimeEntry[]>;
    update(timeEntry: TimeEntry): FutureData<void>;
}
