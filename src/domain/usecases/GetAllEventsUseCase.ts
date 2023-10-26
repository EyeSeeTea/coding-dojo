import { FutureData } from "../../data/api-futures";
import { ProductRepository } from "../repositories/ProductRepository";
import { D2Event } from "@eyeseetea/d2-api/api/events";

export class GetAllEventsUseCase {
    constructor(private productsRepository: ProductRepository) {}

    public execute(eventId: string | undefined): FutureData<D2Event[]> {
        return this.productsRepository.getAllEvents(eventId);
    }
}
