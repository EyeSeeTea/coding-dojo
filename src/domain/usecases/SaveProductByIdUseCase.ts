import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { ProductsRepository } from "../repositories/ProductsRepository";

export class SaveProductByIdUseCase {
    constructor(private productRepository: ProductsRepository) {}

    public execute(product: Product): FutureData<void> {
        return this.productRepository.saveProduct(product);
    }
}
