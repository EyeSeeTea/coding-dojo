import { FutureData, Stat } from "../../data/api-futures";
import { TimeRegistry } from "../entities/TimeRegistry";
import { TimeRegistryRepository } from "../repositories/TimeRegistryRepository";

export class SaveTimeRegistryUseCase {
    constructor(private timeRegistryRepository: TimeRegistryRepository) {}

    public execute(timeRegistry: TimeRegistry): FutureData<Stat> {
        return this.timeRegistryRepository.save(timeRegistry);
    }
}
