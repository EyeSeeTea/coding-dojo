import { Item } from "./Item";
import { Updatable } from "../repositories/UpdatableItem";
import { BasicItem } from "./BasicItem";

export class BrieItem extends BasicItem implements Updatable {
    constructor(sellIn: number, quality: number) {
        super("Aged Brie", sellIn, quality);
    }

    updateQuality(): void {
        // Quality never more than 50
        if (this.quality < 50) {
            this.quality = this.quality + 1;
        }
    }

    updateQualityWhenPassedSellIn(): void {
        // Quality never more than 50
        if (this.quality < 50) {
            this.quality = this.quality + 1;
        }
    }
}
