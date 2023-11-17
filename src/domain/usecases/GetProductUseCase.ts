import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/ProductRepository";

export class GetProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    public execute(id: string): FutureData<Product> {
        return this.productRepository.get(id);
    }
}
