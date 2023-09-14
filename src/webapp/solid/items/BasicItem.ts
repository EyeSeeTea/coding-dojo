import { Item } from "../Item/Item";
import { Updatable } from "../UpdatableItem/UpdatableItem";

export class BasicItem extends Item implements Updatable {
    constructor(name: string, sellIn: number, quality: number) {
        super(name, sellIn, quality);
    }

    updateQuality(): void {
        // Quality never negative
        if (this.quality > 0) {
            this.quality = this.quality - 1;
        }
    }

    updateSellIn(): void {
        this.sellIn = this.sellIn - 1;
    }

    updateQualityWhenPassedSellIn(): void {
        // Quality never negative
        if (this.quality > 0) {
            this.quality = this.quality - 1;
        }
    }
}
