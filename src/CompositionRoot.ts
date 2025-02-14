import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetManagersUseCase } from "./domain/usecases/GetManagersUseCase";
import { D2Api } from "./types/d2-api";
import { TimeTrackingRepository } from "./domain/repositories/TimeTrackingRepository";
import { ManagerRepository } from "./domain/repositories/ManagerRepository";
import { ApproveTimeTrackingsUseCase } from "./domain/usecases/ApproveTimeTrackingsUseCase";
import { ListTimeTrackingsOfManagerUseCase } from "./domain/usecases/ListTimeTrackingsOfManagerUseCase";
import { ManagerTestRepository } from "./data/repositories/ManagerTestRepository";
import { ApprovedTimeTrackingTestRepository } from "./data/repositories/TimeTrackingTestRepository";
import { ManagerD2Repository } from "./data/repositories/ManagerD2Repository";
import { TimeTrackingD2Repository } from "./data/repositories/TimeTrackingD2Repository";
import { NotificationRepository } from "./domain/repositories/NotificationRepository";
import { NotificationD2Repository } from "./data/repositories/NotificationD2Repository";
import { NotificationTestRepository } from "./data/repositories/NotificationTestRepository";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    managerRepository: ManagerRepository;
    timeTrackingRepository: TimeTrackingRepository;
    notificationRepository: NotificationRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        manager: {
            getAll: new GetManagersUseCase(repositories.managerRepository),
        },
        timeTracking: {
            approve: new ApproveTimeTrackingsUseCase({
                timeTrackingReposiory: repositories.timeTrackingRepository,
                managerRepository: repositories.managerRepository,
                notificationRepository: repositories.notificationRepository,
            }),
            list: new ListTimeTrackingsOfManagerUseCase(repositories.timeTrackingRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        managerRepository: new ManagerD2Repository(api),
        timeTrackingRepository: new TimeTrackingD2Repository(api),
        notificationRepository: new NotificationD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        managerRepository: new ManagerTestRepository(),
        timeTrackingRepository: new ApprovedTimeTrackingTestRepository(),
        notificationRepository: new NotificationTestRepository(),
    };

    return getCompositionRoot(repositories);
}
