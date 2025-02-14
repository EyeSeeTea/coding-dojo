import { NotificationMessageD2Repository } from "./data/repositories/NotificationMessageD2Repository";
import { NotificationMessageTestRepository } from "./data/repositories/test/NotificationMessageTestRepository";
import { TimeTrackingTestRepository } from "./data/repositories/test/TimeTrackingTestRepository";
import { UserTestRepository } from "./data/repositories/test/UserTestRepository";
import { TimeTrackingD2Repository } from "./data/repositories/TimeTrackingD2Repository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { NotificationMessageRepository } from "./domain/repositories/NotificationMessageRepository";
import { TimeTrackingRepository } from "./domain/repositories/TimeTrackingRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { ApproveTimeTrackingUseCase } from "./domain/usecases/ApproveTimeTrackingUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { ListTimeTrackingsByManagerUseCase } from "./domain/usecases/ListTimeTrackingsByManagerUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    userRepository: UserRepository;
    timeTrackingRepository: TimeTrackingRepository;
    notificationMessageRepository: NotificationMessageRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.userRepository),
        },
        timeTrackings: {
            approve: new ApproveTimeTrackingUseCase(repositories),
            listByManger: new ListTimeTrackingsByManagerUseCase(repositories),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        userRepository: new UserD2Repository(api),
        timeTrackingRepository: new TimeTrackingD2Repository(api),
        notificationMessageRepository: new NotificationMessageD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        userRepository: new UserTestRepository(),
        timeTrackingRepository: new TimeTrackingTestRepository(),
        notificationMessageRepository: new NotificationMessageTestRepository(),
    };

    return getCompositionRoot(repositories);
}
