import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { Id } from "../entities/Ref";
import { Future } from "../entities/generic/Future";
import { ProductRepository } from "../repositories/ProductRepository";

export class SaveProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    execute(product: Product): FutureData<Product> {
        if (!Product.isValidNumber(product.quantity))
            return Future.error(new Error("Only numbers are allowed"));

        if (!Product.isPositiveNumber(product.quantity))
            return Future.error(new Error("Only positive numbers are allowed"));

        return this.getProductById(product.id).flatMap(prevProduct => {
            return this.productRepository.save(
                new Product({
                    ...prevProduct,
                    ...product.update(product.quantity),
                })
            );
        });
    }

    private getProductById(id: Id): FutureData<Product> {
        return this.productRepository.getById(id);
    }
}
