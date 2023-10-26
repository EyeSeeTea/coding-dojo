import { PaginatedObjects } from "@eyeseetea/d2-api/api";
import { FutureData } from "../../data/api-futures";
import { ProductOptions, ProductRepository } from "../repositories/ProductRepository";
import { Event } from "../entities/Product";

export class GetProgramEventsUseCase {
    constructor(private productsRepository: ProductRepository) {}

    public execute(options: ProductOptions): FutureData<PaginatedObjects<Event>> {
        return this.productsRepository.getProductList(options);
    }
}
