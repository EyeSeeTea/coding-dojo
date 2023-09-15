import { ItemProviderRepository } from "../repositories/ItemProviderRepository";
import { UpdatableItem } from "../repositories/UpdatableItem";
import { SulfurasItem } from "./SulfurasItem";

export class GildedRose {
    constructor(private itemProvider: ItemProviderRepository) {}

    updateQuality(): (UpdatableItem | SulfurasItem)[] {
        const items = this.itemProvider.get();

        items.forEach(item => {
            if (item.name !== "Sulfuras, Hand of Ragnaros") {
                item.updateQuality();

                // Decrease sellIn by 1
                item.updateSellIn();

                // If sellIn has passed
                if (item.sellIn < 0) {
                    item.updateQualityWhenPassedSellIn();
                }
            }
        });

        return items;
    }
}
