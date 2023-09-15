import { Item } from "./Item";

export class BasicItem extends Item {
    protected qualityCap = { min: 0, max: 50 };
    protected sellInUpdateValue = -1;
    protected qualityUpdateValue = -1;

    protected refreshQualityUpadateValue() {
        if (this.sellIn <= 0) {
            this.qualityUpdateValue += this.qualityUpdateValue;
        }
    }

    protected updateSellIn() {
        this.sellIn += this.sellInUpdateValue;
    }

    protected checkQualityCap() {
        if (this.quality > this.qualityCap.max) {
            this.quality = this.qualityCap.max;
        }

        if (this.quality < this.qualityCap.min) {
            this.quality = this.qualityCap.min;
        }
    }

    protected updateQuality() {
        this.quality += this.qualityUpdateValue;
        this.checkQualityCap();
    }

    update() {
        this.refreshQualityUpadateValue();
        this.updateSellIn();
        this.updateQuality();
    }
}
