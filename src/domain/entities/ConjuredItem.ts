import { Item } from "./Item";
import { Updatable } from "../repositories/UpdatableItem";
import { BasicItem } from "./BasicItem";

export class ConjuredItem extends BasicItem implements Updatable {
    constructor(sellIn: number, quality: number) {
        super("Conjured Mana Cake", sellIn, quality);
    }

    updateQuality(): void {
        // Quality never negative
        if (this.quality > 0) {
            this.quality = this.quality - 2;
        }
    }

    updateQualityWhenPassedSellIn(): void {
        // Quality never negative
        if (this.quality > 0) {
            this.quality = this.quality - 2;
        }
    }
}
