import { FutureData } from "../../data/api-futures";
import { PaginatedObjects, Paging, Sorting } from "../entities/Pagination";
import { Product } from "../entities/Product";

export interface ProductRepository {
    get(id: string): FutureData<Product>;
    getList(paging: Paging, sorting: Sorting<Product>): FutureData<PaginatedObjects<Product>>;
    update(product: Product): FutureData<string>;
}
