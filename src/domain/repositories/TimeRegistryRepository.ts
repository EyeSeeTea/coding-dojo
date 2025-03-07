import { FutureData, Stat } from "../../data/api-futures";
import { TimeRegistry } from "../entities/TimeRegistry";

export interface TimeRegistryRepository {
    get(): FutureData<TimeRegistry[]>;
    save(timeRegistry: TimeRegistry): FutureData<Stat>;
}
