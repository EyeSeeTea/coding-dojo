import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { D2Api } from "./types/d2-api";
import { ChartTestRepository } from "./data/repositories/ChartTestRepository";
import { ChartRepository } from "./domain/repositories/ChartRepository";
import { ListChartsUseCase } from "./domain/usecases/ListChartsUseCase";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    chartRepository: ChartRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        charts: {
            list: new ListChartsUseCase(repositories.chartRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        chartRepository: new ChartTestRepository(),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        chartRepository: new ChartTestRepository(),
    };

    return getCompositionRoot(repositories);
}
