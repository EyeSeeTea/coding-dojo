import { DataElementD2Repository } from "./data/repositories/DataElementD2Repository";
import { DataElementTestRepository } from "./data/repositories/__tests__/DataElementTestRepository";
import { UserAdminTestRepository } from "./data/repositories/__tests__/UserAdminTestRepository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserNonAdminTestRepository } from "./data/repositories/__tests__/UserNonAdminTestRepository";

import { DataElementRepository } from "./domain/repositories/DataElementRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetAllDataElementsUseCase } from "./domain/usecases/GetAllDataElementsUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { D2Api } from "./types/d2-api";

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
                repositories.usersRepository,
                repositories.dataElementRepository
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

export function getTestCompositionRoot(isAdmin = true) {
    const repositories: Repositories = {
        usersRepository: isAdmin ? new UserAdminTestRepository() : new UserNonAdminTestRepository(),
        dataElementRepository: new DataElementTestRepository(),
    };

    return getCompositionRoot(repositories);
}
