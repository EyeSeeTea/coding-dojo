import { FutureData } from "../../data/api-futures";
import { Day } from "../entities/Day";
import { Id } from "../entities/Ref";
import { TimeEntry, TimeEntryApprovalStatus } from "../entities/TimeEntry";

export interface GetTimeEntriesFilters {
    managerId?: Id;
    status?: TimeEntryApprovalStatus;
    from?: Day;
    to?: Day;
}

export interface TimeEntryRepository {
    get(options?: GetTimeEntriesFilters): FutureData<TimeEntry[]>;
    update(timeEntry: TimeEntry): FutureData<void>;
}
