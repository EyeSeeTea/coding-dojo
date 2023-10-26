import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/ProductRepository";

export class GetProductsUseCase {
    constructor(private productsRepository: ProductRepository) {}

    public execute(): FutureData<Product[]> {
        return this.productsRepository.getProducts();
    }
}
