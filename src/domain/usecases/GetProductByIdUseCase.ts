import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { Id } from "../entities/Ref";
import { Future } from "../entities/generic/Future";
import { ProductRepository } from "../repositories/ProductRepository";
import { UserRepository } from "../repositories/UserRepository";

import i18n from "../../utils/i18n";

export class GetProductByIdUseCase {
    constructor(
        private productRepository: ProductRepository,
        private userRepository: UserRepository
    ) {}

    execute(id: Id): FutureData<Product> {
        return this.checkIfUserIsAdmin().flatMap(() => {
            return this.productRepository.getById(id);
        });
    }

    private checkIfUserIsAdmin(): FutureData<void> {
        return this.userRepository.getCurrent().flatMap(user => {
            return user.isAdmin()
                ? Future.success(undefined)
                : Future.error(
                      new Error(i18n.t("Only admin users can edit quantity of a product"))
                  );
        });
    }
}
