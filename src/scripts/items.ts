/*
Hi and welcome to modified Gilded Rose kata version. 
The goal is practice SOLID Principles refactoring this code.
As you know, we are a small inn with a prime location in a prominent city ran by a friendly innkeeper named Allison.
We also buy and sell only the finest goods. Unfortunately, our goods are constantly degrading in quality as they approach their sell by date.
We have a system in place that updates our inventory for us. It was developed by a no-nonsense type named Leeroy, who has moved on to new adventures. 
Your task is to add the new feature to our system so that we can begin selling a new category of items. First an introduction to our system:
All items have a SellIn value which denotes the number of days we have to sell the item
All items have a Quality value which denotes how valuable the item is
At the end of each day our system lowers both values for every item
Pretty simple, right? Well this is where it gets interesting:
Once the sell by date has passed, Quality degrades twice as fast
The Quality of an item is never negative
"Aged Brie" actually increases in Quality the older it gets
The Quality of an item is never more than 50
"Sulfuras", being a legendary item, never has to be sold or decreases in Quality
"Backstage passes", like aged brie, increases in Quality as it's SellIn value approaches; 
   Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but Quality drops to 0 after the concert
We have recently signed a supplier of conjured items. This requires an update to our system:
"Conjured" items degrade in Quality twice as fast as normal items
In the future we can have a provider retrieving data from dhis2. Refactor the code to minimal change would be necessary when we need to do the change
Feel free to make any changes to the previewUpdateQuality method and add any new code as long as everything still works correctly. 
However, do not alter the Item class or Items property as those belong to the goblin in the corner who will insta-rage and one-shot you as he doesn't believe in shared code ownership.
Just for clarification, an item can never have its Quality increase above 50, however "Sulfuras" is a legendary item and as such its Quality is 80 and it never alters.
*/

type ItemVariation = BackStagePasseseItem | NormalItem | ConjuredItem | AgedBrieItem | SulfarasItem;
type ItemName =
    | "Aged Brie"
    | "Sulfuras, Hand of Ragnaros"
    | "Backstage passes to a TAFKAL80ETC concert"
    | "Conjured Mana Cake"
    | "whatever"
    | string;

type NumberOfDays = number;
type Quality = number;

interface ItemUpdater {
    handleUpdate(item: Item): void;
}

export class Item {
    static readonly MAX_QUALITY = 50;
    static readonly MIN_QUALITY = 0;
    name: ItemName;
    sellIn: NumberOfDays;
    quality: Quality;

    constructor(name: ItemName, sellIn: NumberOfDays, quality: Quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }

    toString(): string {
        return `Name: ${this.name} SellIn: ${this.sellIn} Quality: ${this.quality}`;
    }
}
export class ItemInMemoryProvider {
    constructor(private items: Item[]) {}
    get(): Item[] {
        return this.items;
    }
}

export class AgedBrieItem extends Item implements ItemUpdater {
    handleUpdate = (): AgedBrieItem => {
        let updatedQuality = this.quality;

        if (updatedQuality < Item.MAX_QUALITY) {
            updatedQuality = updatedQuality + 1;
        }

        const updatedSellin = this.sellIn - 1;

        if (updatedSellin < 0 && updatedQuality < Item.MAX_QUALITY) {
            updatedQuality = updatedQuality + 1;
        }

        return new AgedBrieItem(this.name, updatedSellin, updatedQuality);
    };
}

export class SulfarasItem extends Item implements ItemUpdater {
    handleUpdate(): SulfarasItem {
        return new SulfarasItem(this.name, this.sellIn, 80);
    }
}

export class BackStagePasseseItem extends Item implements ItemUpdater {
    handleUpdate(): BackStagePasseseItem {
        let updatedQuality = this.quality;

        if (updatedQuality < Item.MAX_QUALITY) {
            updatedQuality = updatedQuality + 1;
            if (this.sellIn <= 10) {
                updatedQuality = updatedQuality + 1;
            }
            if (this.sellIn <= 5) {
                updatedQuality = updatedQuality + 1;
            }
        }

        const updatedSellin = this.sellIn - 1;

        if (updatedSellin < 0) {
            updatedQuality = updatedQuality - updatedQuality;
        }

        return new BackStagePasseseItem(this.name, updatedSellin, updatedQuality);
    }
}

export class NormalItem extends Item implements ItemUpdater {
    handleUpdate(): NormalItem {
        let updatedQuality = this.quality;
        if (updatedQuality > Item.MIN_QUALITY) updatedQuality = updatedQuality - 1;
        const updatedSellin = this.sellIn - 1;

        if (updatedSellin < 0 && updatedQuality > 0) {
            updatedQuality = updatedQuality - 1;
        }
        return new NormalItem(this.name, updatedSellin, updatedQuality);
    }
}
export class ConjuredItem extends Item implements ItemUpdater {
    handleUpdate(): ConjuredItem {
        let updatedQuality = this.quality;
        if (updatedQuality > 1) updatedQuality = updatedQuality - 2;
        const updatedSellin = this.sellIn - 1;

        if (updatedSellin < 0 && updatedQuality > 1) {
            updatedQuality = updatedQuality - 2;
        }

        return new ConjuredItem(this.name, updatedSellin, updatedQuality);
    }
}

const itemFactory = (item: Item): ItemVariation => {
    const args = [item.name, item.sellIn, item.quality] as const;

    switch (item.name) {
        case "Aged Brie": {
            return new AgedBrieItem(...args);
        }

        case "Sulfuras, Hand of Ragnaros": {
            return new SulfarasItem(...args);
        }

        case "Backstage passes to a TAFKAL80ETC concert": {
            return new BackStagePasseseItem(...args);
        }

        case "Conjured Mana Cake": {
            return new ConjuredItem(...args);
        }

        default: {
            return new NormalItem(...args);
        }
    }
};

export class GildedRose {
    constructor(private itemProvider: ItemInMemoryProvider) {}

    updateQuality(): Item[] {
        const items = this.itemProvider.get();

        const updatedItems = items.map(item => {
            const childItem = itemFactory(item);
            return childItem.handleUpdate();
        });

        return updatedItems;
    }
}
