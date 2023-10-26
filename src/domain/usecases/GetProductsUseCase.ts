import { FutureData } from "../../data/api-futures";
import { ProductWithPaging } from "../entities/ProductWithPaging";
import { ProductGetAllOptions, ProductRepository } from "../repositories/ProductRepository";

export class GetProductsUseCase {
    constructor(private productRepository: ProductRepository) {}

    execute(options: ProductGetAllOptions): FutureData<ProductWithPaging> {
        return this.productRepository.getAll(options);
    }
}
