import { Product } from "../../domain/entities/Product";
import { Future } from "../../domain/entities/generic/Future";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { FutureData } from "../api-futures";

export class ProductTestRepository implements ProductRepository {
    getAll(): FutureData<Product[]> {
        return Future.success([]);
    }
    saveProduct(product: Product): FutureData<void> {
        return Future.success(undefined);
    }
}
