import { ReferenceObject } from "@eyeseetea/d2-ui-components";
import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";

export interface ProductRepository {
    getAll(pagination: PaginationOptions): FutureData<ProductView[]>;
    saveProduct(product: ProductView): FutureData<void>;
}

export interface PaginationOptions {
    page: number;
    pageSize: number;
    order: string;
}

export interface ProductView extends Product, ReferenceObject {}

// ${sorting.field}:${sorting.order}
