import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { ProductWithPaging } from "../entities/ProductWithPaging";
import { Id } from "../entities/Ref";

export interface ProductRepository {
    getAll(options: ProductGetAllOptions): FutureData<ProductWithPaging>;
    getById(id: Id): FutureData<Product>;
    save(product: Product): FutureData<Product>;
}

export type ProductGetAllOptions = {
    page: number;
    pageSize: number;
    sorting: {
        field: string;
        order: string;
    };
};
