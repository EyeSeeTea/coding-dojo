export class Item {
    name: string;
    sellIn: number;
    quality: number;

    constructor(name: string, sellIn: number, quality: number) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }

    toString(): string {
        return `Name: ${this.name} SellIn: ${this.sellIn} Quality: ${this.quality}`;
    }
}

interface ItemCategory {
    updateQuality(item: Item): void;
}

class DefaultItemCategory implements ItemCategory {
    updateQuality(item: Item): void {
        if (item.quality > 0) {
            item.quality -= 1;
        }
        item.sellIn -= 1;
        if (item.sellIn < 0 && item.quality > 0) {
            item.quality -= 1;
        }
    }
}

class AgedBrieItemCategory implements ItemCategory {
    updateQuality(item: Item): void {
        if (item.quality < 50) {
            item.quality += 1;
        }
        item.sellIn -= 1;
        if (item.sellIn < 0) {
            item.quality *= 2;
        }
    }
}

class SulfurasItemCategory implements ItemCategory {
    updateQuality(): void {
        // Legendary items have fixed values
    }
}

class BackstagePassesItemCategory implements ItemCategory {
    updateQuality(item: Item): void {
        if (item.quality < 50) {
            item.quality += 1;
            if (item.sellIn < 11 && item.quality < 50) {
                item.quality += 1;
            }
            if (item.sellIn < 6 && item.quality < 50) {
                item.quality += 1;
            }
        }
        item.sellIn -= 1;
        if (item.sellIn < 0) {
            item.quality = 0;
        }
    }
}

class ConjuredItemCategory implements ItemCategory {
    updateQuality(item: Item): void {
        if (item.quality > 0) {
            item.quality -= 2;
        }
        item.sellIn -= 1;
        if (item.sellIn < 0 && item.quality > 0) {
            item.quality -= 2;
        }
    }
}

export class ItemInMemoryProvider {
    constructor(private items: Item[]) {}
    get(): Item[] {
        return this.items;
    }
}

export class GildedRose {
    constructor(private itemProvider: ItemInMemoryProvider) {}

    updateQuality(): Item[] {
        const items = this.itemProvider.get();

        items.forEach(item => {
            const itemCategory = this.getItemCategory(item);
            itemCategory.updateQuality(item);
        });

        return items;
    }

    private getItemCategory(item: Item) {
        switch (item.name) {
            case "Aged Brie":
                return new AgedBrieItemCategory();
            case "Sulfuras, Hand of Ragnaros":
                return new SulfurasItemCategory();
            case "Backstage passes to a TAFKAL80ETC concert":
                return new BackstagePassesItemCategory();
            case "Conjured Mana Cake":
                return new ConjuredItemCategory();
            default:
                return new DefaultItemCategory();
        }
    }
}
