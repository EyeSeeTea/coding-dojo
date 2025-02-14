import { FutureData } from "../../data/api-futures";
import { Future } from "../entities/generic/Future";
import { Id } from "../entities/Ref";
import { TimeTracking } from "../entities/TimeTracking";
import { TimeTrackingRepository } from "../repositories/TimeTrackingRepository";
import { UserRepository } from "../repositories/UserRepository";

export class ListTimeTrackingsByManagerUseCase {
    constructor(
        private options: {
            timeTrackingRepository: TimeTrackingRepository;
            userRepository: UserRepository;
        }
    ) {}

    public execute(mangerId: Id): FutureData<TimeTracking[]> {
        return this.options.userRepository.getManager(mangerId).flatMap(manager => {
            return this.options.timeTrackingRepository
                .getByManager(mangerId)
                .flatMap(timeTrackerBases => {
                    const timeTrackings: TimeTracking[] = timeTrackerBases.map(timeTrackingBase => {
                        return TimeTracking.create({ ...timeTrackingBase, manager });
                    });
                    return Future.success(timeTrackings);
                });
        });

        //I am filtering the time tracking by manger in the repo as i know they will be events in a TEI.
        // Then we are making decisions based on implementation?

        // return this.timeTrackingRepository.get().map((timeTrackings: TimeTracking[]) => {
        //     return timeTrackings.filter(timeTracking => timeTracking.manager.id === mangerId);
        // });
    }
}
