import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { Id } from "../entities/Ref";
import { ProductsRepository } from "../repositories/ProductsRepository";

export class GetProductByIdUseCase {
    constructor(private productRepository: ProductsRepository) {}

    public execute(id: Id): FutureData<Product> {
        return this.productRepository.getProduct(id);
    }
}
