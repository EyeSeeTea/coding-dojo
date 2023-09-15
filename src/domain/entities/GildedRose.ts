import { ItemInMemoryProvider } from "../usecases/ItemInMemoryProvider";
import { BackstagePassesItem } from "./BackstageItem";
import { BasicItem } from "./BasicItem";
import { BrieItem } from "./BrieItem";
import { ConjuredItem } from "./ConjuredItem";
import { LegendaryItem } from "./LegendaryItem";

export type GildedRoseItem = BasicItem | BrieItem | LegendaryItem | BackstagePassesItem | ConjuredItem;

export class GildedRose {
    constructor(private itemProvider: ItemInMemoryProvider) {}

    updateQuality(): GildedRoseItem[] {
        const items = this.itemProvider.get();

        return items.map(item => {
            return item.update();
        });
    }
}
