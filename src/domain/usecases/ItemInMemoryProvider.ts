import { BackstagePassesItem } from "../entities/BackstageItem";
import { BasicItem } from "../entities/BasicItem";
import { BrieItem } from "../entities/BrieItem";
import { ConjuredItem } from "../entities/ConjuredItem";
import { GildedRoseItem } from "../entities/GildedRose";
import { Item } from "../entities/Item";
import { LegendaryItem } from "../entities/LegendaryItem";
import { ItemProviderRepository } from "../repositories/ItemProviderRepository";

export class ItemInMemoryProvider implements ItemProviderRepository {
    private items: GildedRoseItem[];
    private specialItemsDict: { [key: string]: string } = {
        "aged brie": "cheese",
        "sulfuras, hand of ragnaros": "legendary",
        "backstage passes to a tafkal80etc concert": "backstagePasses",
        "conjured mana cake": "conjured",
    };

    constructor(items: Item[]) {
        this.items = items.map(item => {
            const itemClass = this.itemClass(item.name);

            switch (itemClass) {
                case "cheese":
                    return new BrieItem(item.name, item.sellIn, item.quality);
                case "legendary":
                    return new LegendaryItem(item.name, item.sellIn, item.quality);
                case "backstagePasses":
                    return new BackstagePassesItem(item.name, item.sellIn, item.quality);
                case "conjured":
                    return new ConjuredItem(item.name, item.sellIn, item.quality);
                default:
                    return new BasicItem(item.name, item.sellIn, item.quality);
            }
        });
    }

    private itemClass(itemName: string): string {
        const itemClass = this.specialItemsDict[itemName.toLowerCase()];
        return itemClass ? itemClass : "basic";
    }

    get(): GildedRoseItem[] {
        return this.items;
    }
}
