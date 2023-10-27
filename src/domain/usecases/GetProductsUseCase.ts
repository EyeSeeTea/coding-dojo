import { Pager } from "@eyeseetea/d2-api/2.36";
import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { ProductsRepository } from "../repositories/ProductsRepository";

export class GetProductsUseCase {
    constructor(private productRepository: ProductsRepository) {}

    public execute(
        page: number,
        pageSize: number,
        sortingField: string,
        sortingOrder: "asc" | "desc"
    ): FutureData<{ pager: Pager; objects: Product[] }> {
        return this.productRepository.getProducts(page, pageSize, sortingField, sortingOrder);
    }
}
