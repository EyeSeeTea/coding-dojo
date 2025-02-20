import { NotificationD2Repository } from "./data/repositories/NotificationD2Repository";
import { NotificationTestRepository } from "./data/repositories/NotificationTestRepository";
import { TimeTrackingD2Repository } from "./data/repositories/TimeTrackingD2Repository";
import { TimeTrackingTestRepository } from "./data/repositories/TimeTrackingTestRepository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { NotificationRepository } from "./domain/repositories/NotificationRepository";
import { TimeTrackingRepository } from "./domain/repositories/TimeTrackingRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { ApproveTimeTrackingUseCase } from "./domain/usecases/ApproveTimeTrackingUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetTimeTrackingsUseCase } from "./domain/usecases/GetTimeTrackingsUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    timeTrackingRepository: TimeTrackingRepository;
    notificationRepository: NotificationRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        timeTracking: {
            get: new GetTimeTrackingsUseCase(
                repositories.usersRepository,
                repositories.timeTrackingRepository
            ),
            approve: new ApproveTimeTrackingUseCase(
                repositories.usersRepository,
                repositories.timeTrackingRepository,
                repositories.notificationRepository
            ),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        timeTrackingRepository: new TimeTrackingD2Repository(api),
        notificationRepository: new NotificationD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        notificationRepository: new NotificationTestRepository(),
        timeTrackingRepository: new TimeTrackingTestRepository(),
    };

    return getCompositionRoot(repositories);
}
