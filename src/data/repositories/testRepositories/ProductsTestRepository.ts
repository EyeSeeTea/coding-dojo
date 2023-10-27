import { FutureData } from "../../api-futures";
import { ProductsRepository } from "../../../domain/repositories/ProductsRepository";
import { Product } from "../../../domain/entities/Product";
import { Pager } from "@eyeseetea/d2-api/api";

export class ProductsTestRepository implements ProductsRepository {
    saveProduct(product: Product): FutureData<void> {
        console.debug(product);
        throw new Error("Method not implemented.");
    }
    getProducts(
        page: number,
        pageSize: number,
        sortingField: string,
        sortingOrder: "desc" | "asc"
    ): FutureData<{ pager: Pager; objects: Product[] }> {
        console.debug(page, pageSize, sortingField, sortingOrder);
        throw new Error("Method not implemented.");
    }

    getProduct(id: string): FutureData<Product> {
        console.debug(id);
        throw new Error("Method not implemented.");
    }
}
