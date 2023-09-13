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

abstract class ItemCategory {
    constructor(protected item: Item) {}

    abstract updateQuality(): void;
}

class DefaultItemCategory extends ItemCategory {
    updateQuality(): void {
        this.item.sellIn--;
        let qualityChange = 1;

        if (this.item.sellIn < 0) {
            qualityChange *= 2;
        }

        this.item.quality = Math.max(0, Math.min(50, this.item.quality - qualityChange));
    }
}

class AgedBrieItemCategory extends ItemCategory {
    updateQuality(): void {
        this.item.sellIn--;
        let qualityChange = 1;

        if (this.item.sellIn < 0) {
            qualityChange *= 2;
        }

        this.item.quality = Math.min(50, this.item.quality + qualityChange);
    }
}

class SulfurasItemCategory extends ItemCategory {
    updateQuality(): void {
        // Legendary items have fixed values
    }
}

class BackstagePassesItemCategory extends ItemCategory {
    updateQuality(): void {
        this.item.sellIn--;
        let qualityChange = 1;

        if (this.item.sellIn < 0) {
            qualityChange = -this.item.quality;
        } else if (this.item.sellIn < 5) {
            qualityChange = 3;
        } else if (this.item.sellIn >= 5 && this.item.sellIn < 10) {
            qualityChange = 2;
        }

        this.item.quality = Math.min(50, this.item.quality + qualityChange);
    }
}

class ConjuredItemCategory extends ItemCategory {
    updateQuality(): void {
        this.item.sellIn--;
        let qualityChange = 2;

        if (this.item.sellIn < 0) {
            qualityChange *= 2;
        }

        this.item.quality = Math.max(0, this.item.quality - qualityChange);
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
            itemCategory.updateQuality();
        });

        return items;
    }

    private getItemCategory(item: Item): ItemCategory {
        switch (item.name) {
            case "Aged Brie":
                return new AgedBrieItemCategory(item);
            case "Sulfuras, Hand of Ragnaros":
                return new SulfurasItemCategory(item);
            case "Backstage passes to a TAFKAL80ETC concert":
                return new BackstagePassesItemCategory(item);
            case "Conjured Mana Cake":
                return new ConjuredItemCategory(item);
            default:
                return new DefaultItemCategory(item);
        }
    }
}
