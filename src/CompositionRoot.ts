import { ProductD2Repository } from "./data/repositories/ProductD2Repository";
import { ProductTestRepository } from "./data/repositories/ProductTestRepository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { ProductRepository } from "./domain/repositories/ProductRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetAllEventsUseCase } from "./domain/usecases/GetAllEventsUseCase";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetProgramEventsUseCase } from "./domain/usecases/GetProgramEventsUseCase";
import { SaveProgramEventsUseCase } from "./domain/usecases/SaveProgramEventsUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    productsRepository: ProductRepository;
};

function getCompositionRoot(repositories: Repositories, api?: D2Api) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        api: {
            get: api,
        },
        products: {
            getProductList: new GetProgramEventsUseCase(repositories.productsRepository),
            getAllEvents: new GetAllEventsUseCase(repositories.productsRepository),
            save: new SaveProgramEventsUseCase(repositories.productsRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        productsRepository: new ProductD2Repository(api),
    };

    return getCompositionRoot(repositories, api);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        productsRepository: new ProductTestRepository(),
    };

    return getCompositionRoot(repositories);
}
