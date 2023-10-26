import { FutureData } from "../../data/api-futures";
import { ProductRepository } from "../repositories/ProductRepository";
import { D2EventToPost } from "@eyeseetea/d2-api/api/events";

export class SaveProgramEventsUseCase {
    constructor(private productsRepository: ProductRepository) {}

    public execute(eventToPost: D2EventToPost): FutureData<boolean> {
        return this.productsRepository.save(eventToPost);
    }
}
