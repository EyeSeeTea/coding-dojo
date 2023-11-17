import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/ProductRepository";
import { Paging, Sorting, PaginatedObjects } from "../entities/Pagination";

export class GetProductListUseCase {
    constructor(private productRepository: ProductRepository) {}

    public execute(
        paging: Paging,
        sorting: Sorting<Product>
    ): FutureData<PaginatedObjects<Product>> {
        return this.productRepository.getList(paging, sorting);
    }
}
