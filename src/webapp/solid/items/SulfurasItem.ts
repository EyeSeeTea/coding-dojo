import { Item } from "../Item/Item";
import { Updatable } from "../UpdatableItem/UpdatableItem";
import { BasicItem } from "./BasicItem";

export class SulfurasItem extends BasicItem implements Updatable {
    constructor() {
        super("Sulfuras, Hand of Ragnaros", 0, 80);
    }

    updateQuality(): void {}

    updateQualityWhenPassedSellIn(): void {}
}
