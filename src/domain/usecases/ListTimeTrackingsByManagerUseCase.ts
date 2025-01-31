import { FutureData } from "../../data/api-futures";
import { Id } from "../entities/Ref";
import { TimeTracking } from "../entities/TimeTracking";
import { TimeTrackingRepository } from "../repositories/TimeTrackingRepository";

export class ListTimeTrackingsByManagerUseCase {
    constructor(private timeTrackingRepository: TimeTrackingRepository) {}

    public execute(mangerId: Id): FutureData<TimeTracking[]> {
        return this.timeTrackingRepository.getByManager(mangerId);

        //I am filtering the time tracking by manger in the repo as i know they will be events in a TEI.
        // Then we are making decisions based on implementation?

        // return this.timeTrackingRepository.get().map((timeTrackings: TimeTracking[]) => {
        //     return timeTrackings.filter(timeTracking => timeTracking.manager.id === mangerId);
        // });
    }
}
