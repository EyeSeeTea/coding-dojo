import { ProductD2Repository } from "./data/repositories/ProductRepository";
import { ProductTestRepository } from "./data/repositories/ProductTestRepository";
import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { ProductRepository } from "./domain/repositories/ProductRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetProductsUseCase } from "./domain/usecases/GetProductsUseCase";
import { SaveProductUseCase } from "./domain/usecases/SaveProductUseCase";
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
        products: {
            getProducts: new GetProductsUseCase(repositories.productsRepository),
            saveProduct: new SaveProductUseCase(
                repositories.productsRepository,
                repositories.usersRepository
            ),
        },
        api: {
            get: api,
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
