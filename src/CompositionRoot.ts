import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetAllDataElementsUseCase } from "./domain/usecases/GetAllDataElementsUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { D2Api } from "./types/d2-api";
import { DataElementRepository } from "./domain/repositories/DataElementRepository";
import { UserTestRepository } from "./data/repositories/__tests__/UserTestRepository";
import { DataElementTestRepository } from "./data/repositories/__tests__/DataElementTestRepository";
import { DataElementD2Repository } from "./data/repositories/DataElementD2Repository";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    dataElementRepository: DataElementRepository;
};

function getCompositionRoot(repositories: Repositories) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        dataElements: {
            getAll: new GetAllDataElementsUseCase(
                repositories.dataElementRepository,
                repositories.usersRepository
            ),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        dataElementRepository: new DataElementD2Repository(api),
    };

    return getCompositionRoot(repositories);
}

export function getTestCompositionRoot(isAdmin?: boolean) {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(isAdmin),
        dataElementRepository: new DataElementTestRepository(),
    };

    return getCompositionRoot(repositories);
}
