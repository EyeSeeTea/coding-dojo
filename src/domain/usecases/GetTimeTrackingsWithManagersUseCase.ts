import { FutureData } from "../../data/api-futures";
import { TimeTracking } from "../entities/TimeTracking";
import { TimeTrackingWithManager } from "../entities/TimeTrackingWithManager";
import { User } from "../entities/User";
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

    execute(options: GetTimeTrackingOptions): FutureData<Paginated<TimeTrackingWithManager>> {
        return this.userHasPermissions().flatMap(() => {
            return this.timeTrackingRepository.get(options).flatMap(paginatedResponse => {
                const managersIds = this.getManagerIds(paginatedResponse.data);
                return this.userRepository.getByIds(managersIds).map(users => {
                    return {
                        ...paginatedResponse,
                        data: this.buildWithManager(paginatedResponse.data, users),
                    };
                });
            });
        });
    }

    private userHasPermissions(): FutureData<User> {
        return this.userRepository.getCurrent().flatMap(user => {
            return user.isAdmin()
                ? Future.success(user)
                : Future.error(new Error("User does not have permissions"));
        });
    }

    private getManagerIds(timeTrackings: TimeTracking[]): string[] {
        return timeTrackings.map(timeTracking => timeTracking.managerId);
    }

    private buildWithManager(
        timeTrackings: TimeTracking[],
        managers: User[]
    ): TimeTrackingWithManager[] {
        return timeTrackings.map(timeTracking => {
            const manager = managers.find(user => user.id === timeTracking.managerId);
            if (!manager) throw new Error("Manager not found");
            return { timeTrackings: timeTracking, manager };
        });
    }
}
