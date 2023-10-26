import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";

export interface ProductRepository {
    getProducts(): FutureData<Product[]>;
    saveProduct(product: Product): FutureData<void>;
}
