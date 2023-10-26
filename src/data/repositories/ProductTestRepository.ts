import { Product } from "../../domain/entities/Product";
import { createProducts } from "../../domain/entities/__tests__/productFixtures";
import { Future } from "../../domain/entities/generic/Future";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { FutureData } from "../api-futures";

export class ProductTestRepository implements ProductRepository {
    getProducts(): FutureData<Product[]> {
        return Future.success(createProducts());
    }
    saveProduct(product: Product): FutureData<void> {
        return Future.void() as FutureData<void>;
    }
}
