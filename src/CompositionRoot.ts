import { UserD2Repository } from "./data/repositories/UserD2Repository";
import { UserTestRepository } from "./data/repositories/UserTestRepository";
import { UserRepository } from "./domain/repositories/UserRepository";
import { GetCurrentUserUseCase } from "./domain/usecases/GetCurrentUserUseCase";
import { GetProductListUseCase } from "./domain/usecases/GetProductListUseCase";
import { GetProductUseCase } from "./domain/usecases/GetProductUseCase";
import { UpdateProductQuantityUseCase } from "./domain/usecases/UpdateProductQuantityUseCase";
import { D2Api } from "./types/d2-api";
import { ProductRepository } from "./domain/repositories/ProductRepository";
import { ProductD2Repository } from "./data/repositories/ProductD2Repository";

export type CompositionRoot = ReturnType<typeof getCompositionRoot>;

type Repositories = {
    usersRepository: UserRepository;
    productRepository: ProductRepository;
};

function getCompositionRoot(repositories: Repositories, api?: D2Api) {
    return {
        users: {
            getCurrent: new GetCurrentUserUseCase(repositories.usersRepository),
        },
        api: {
            get: api,
        },
        product: {
            get: new GetProductUseCase(repositories.productRepository),
            getList: new GetProductListUseCase(repositories.productRepository),
            update: new UpdateProductQuantityUseCase(repositories.productRepository),
        },
    };
}

export function getWebappCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserD2Repository(api),
        productRepository: new ProductD2Repository(api),
    };

    return getCompositionRoot(repositories, api);
}

export function getTestCompositionRoot(api: D2Api) {
    const repositories: Repositories = {
        usersRepository: new UserTestRepository(),
        productRepository: new ProductD2Repository(api),
    };

    return getCompositionRoot(repositories);
}
