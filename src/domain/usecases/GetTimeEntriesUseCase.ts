import { FutureData } from "../../data/api-futures";
import { TimeEntry } from "../entities/TimeEntry";
import { GetTimeEntriesFilters, TimeEntryRepository } from "../repositories/TimeEntryRepository";

export class GetTimeEntriesUseCase {
    constructor(private timeEntryRepository: TimeEntryRepository) {}

    public execute(filters?: GetTimeEntriesFilters): FutureData<TimeEntry[]> {
        return this.timeEntryRepository.get(filters);
    }
}
