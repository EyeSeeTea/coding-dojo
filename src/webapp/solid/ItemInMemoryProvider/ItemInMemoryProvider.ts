import { ItemProviderRepository } from "../ItemProvider/ItemProvider";
import { UpdatableItem } from "../UpdatableItem/UpdatableItem";
import { SulfurasItem } from "../items/SulfurasItem";

export class ItemInMemoryProvider implements ItemProviderRepository {
    constructor(private items: (UpdatableItem | SulfurasItem)[]) {}
    get(): (UpdatableItem | SulfurasItem)[] {
        return this.items;
    }
}
