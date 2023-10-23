import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/ProductRepository";

export class UpdateProductQuantityUseCase {
    constructor(private productRepository: ProductRepository) {}

    public execute(product: Product): FutureData<void> {
        return this.productRepository.saveProduct(product);
    }
}
