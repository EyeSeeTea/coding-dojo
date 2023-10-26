import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { Future } from "../entities/generic/Future";
import { ProductRepository } from "../repositories/ProductRepository";
import { UserRepository } from "../repositories/UserRepository";

export class SaveProductUseCase {
    constructor(
        private productsRepository: ProductRepository,
        private usersRepository: UserRepository
    ) {}

    public execute(product: Product): FutureData<any> {
        return this.usersRepository.getCurrent().map(user => {
            if (user.isAdmin()) {
                return this.productsRepository.saveProduct(product);
            } else {
                return Future.error("Only admins can edit.");
            }
        });
    }
}
