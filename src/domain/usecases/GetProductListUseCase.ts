import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/ProductRepository";

export class GetProductListUseCase {
    constructor(private productRepository: ProductRepository) {}

    public execute(): FutureData<Product[]> {
        return this.productRepository.getAll();
    }
}
