import { Item } from "./Item";
import { Updatable } from "../repositories/UpdatableItem";
import { BasicItem } from "./BasicItem";

export class BackstageItem extends BasicItem implements Updatable {
    constructor(sellIn: number, quality: number) {
        super("Backstage passes to a TAFKAL80ETC concert", sellIn, quality);
    }

    updateQuality(): void {
        // Quality never more than 50
        if (this.quality < 50) {
            // 10 days or less but more than 5 days sellIn
            if (this.sellIn < 11 && this.sellIn > 5) {
                this.quality = this.quality + 2;
                // when 5 days or less sellIn
            } else if (this.sellIn < 6) {
                this.quality = this.quality + 3;
                // more than 10 days sellIn
            } else {
                this.quality = this.quality + 1;
            }
        }
    }

    updateQualityWhenPassedSellIn(): void {
        this.quality = 0;
    }
}
