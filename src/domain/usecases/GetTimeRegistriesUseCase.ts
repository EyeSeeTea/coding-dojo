import { FutureData } from "../../data/api-futures";
import { TimeRegistry } from "../entities/TimeRegistry";
import { TimeRegistryRepository } from "../repositories/TimeRegistryRepository";

export class GetCurrentManagerTimeRegistriesUseCase {
    constructor(private timeRegistryRepository: TimeRegistryRepository) {}

    public execute(): FutureData<TimeRegistry[]> {
        return this.timeRegistryRepository.get();
    }
}
