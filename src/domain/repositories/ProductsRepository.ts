import { Pager } from "@eyeseetea/d2-api/2.36";
import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { Id } from "../entities/Ref";

export interface ProductsRepository {
    getProduct(id: Id): FutureData<Product>;
    getProducts(
        page: number,
        pageSize: number,
        sortingField: string,
        sortingOrder: "asc" | "desc"
    ): FutureData<{ pager: Pager; objects: Product[] }>;
    saveProduct(product: Product): FutureData<void>;
}
