import { ProductsD2Repository } from "./data/repositories/d2Repositories/ProductsD2Repository";
import { UserD2Repository } from "./data/repositories/d2Repositories/UserD2Repository";
import { ProductsTestRepository } from "./data/repositories/testRepositories/ProductsTestRepository";
import { UserTestRepository } from "./data/repositories/testRepositories/UserTestRepository";
import { ProductsRepository } from "./domain/repositories/ProductsRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetProductByIdUseCase } from "./domain/usecases/GetProductByIdUseCase";
import { GetProductsUseCase } from "./domain/usecases/GetProductsUseCase";
import { SaveProductByIdUseCase } from "./domain/usecases/SaveProductByIdUseCase";
import { D2Api } from "./types/d2-api";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    productsRepository: ProductsRepository;
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
            getProduct: new GetProductByIdUseCase(repositories.productsRepository),
            getProducts: new GetProductsUseCase(repositories.productsRepository),
            saveProduct: new SaveProductByIdUseCase(repositories.productsRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        productsRepository: new ProductsD2Repository(api),
    };

    return getCompositionRoot(repositories, api);
}

export function getTestCompositionRoot() {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        productsRepository: new ProductsTestRepository(),
    };

    return getCompositionRoot(repositories);
}
