import { BasicItem } from "./BasicItem";

export class BackstagePassesItem extends BasicItem {
    protected qualityUpdateValue = 1;

    protected refreshQualityUpadateValue() {
        if (this.sellIn <= 10 && this.sellIn > 5) {
            this.qualityUpdateValue = 2;
        } else if (this.sellIn <= 5 && this.sellIn > 0) {
            this.qualityUpdateValue = 3;
        } else if (this.sellIn < 0) {
            this.qualityUpdateValue = 0;
        } else {
            this.qualityUpdateValue = 1;
        }
    }

    protected updateQuality() {
        if (this.sellIn < 0) {
            this.quality = 0;
        } else {
            this.quality += this.qualityUpdateValue;
        }
        this.checkQualityCap();
    }
}
