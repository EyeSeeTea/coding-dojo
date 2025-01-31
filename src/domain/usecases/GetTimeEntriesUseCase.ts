import { FutureData } from "../../data/api-futures";
import { TimeEntryWithManager } from "../entities/TimeEntry";
import { ManagerRepository } from "../repositories/ManagerRepository";
import { GetTimeEntriesFilters, TimeEntryRepository } from "../repositories/TimeEntryRepository";

export class GetTimeEntriesUseCase {
    constructor(
        private timeEntryRepository: TimeEntryRepository,
        private managerRepository: ManagerRepository
    ) {}

    public execute(filters?: GetTimeEntriesFilters): FutureData<TimeEntryWithManager[]> {
        return this.timeEntryRepository.get(filters).flatMap(timeEntries => {
            const managerIds = Array.from(new Set(timeEntries.map(te => te.managerId)));
            return this.managerRepository.getByIds(managerIds).map(managers => {
                return timeEntries.map(te => {
                    const manager = managers.find(m => m.id === te.managerId);
                    if (!manager) {
                        // TODO: question about handling this kind of errors - wrap in try/catch?
                        throw new Error(`Manager with id ${te.managerId} not found`);
                    }
                    return { ...te, manager };
                });
            });
        });
    }
}
