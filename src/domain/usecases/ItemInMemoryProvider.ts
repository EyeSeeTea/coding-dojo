import { ItemProviderRepository } from "../repositories/ItemProviderRepository";
import { UpdatableItem } from "../repositories/UpdatableItem";
import { SulfurasItem } from "../entities/SulfurasItem";

export class ItemInMemoryProvider implements ItemProviderRepository {
    constructor(private items: (UpdatableItem | SulfurasItem)[]) {}
    get(): (UpdatableItem | SulfurasItem)[] {
        return this.items;
    }
}
