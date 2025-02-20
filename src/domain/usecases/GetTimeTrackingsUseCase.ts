import { FutureData } from "../../data/api-futures";
import { TimeTracking } from "../entities/TimeTracking";
import { Future } from "../entities/generic/Future";
import {
    GetTimeTrackingOptions,
    Paginated,
    TimeTrackingRepository,
} from "../repositories/TimeTrackingRepository";
import { UserRepository } from "../repositories/UserRepository";

export class GetTimeTrackingsUseCase {
    constructor(
        private userRepository: UserRepository,
        private timeTrackingRepository: TimeTrackingRepository
    ) {}

    execute(options: GetTimeTrackingOptions): FutureData<Paginated<TimeTracking>> {
        return this.userHasPermissions().flatMap(() => {
            return this.timeTrackingRepository.get(options);
        });
    }

    private userHasPermissions(): FutureData<void> {
        return this.userRepository.getCurrent().flatMap(user => {
            return user.isAdmin()
                ? Future.success(undefined)
                : Future.error(new Error("User does not have permissions"));
        });
    }
}
