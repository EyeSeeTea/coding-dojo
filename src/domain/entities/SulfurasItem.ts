import { Item } from "./Item";
import { Updatable } from "../repositories/UpdatableItem";
import { BasicItem } from "./BasicItem";

export class SulfurasItem extends BasicItem implements Updatable {
    constructor() {
        super("Sulfuras, Hand of Ragnaros", 0, 80);
    }

    updateQuality(): void {}

    updateQualityWhenPassedSellIn(): void {}
}
