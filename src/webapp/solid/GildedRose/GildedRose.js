"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GildedRose = void 0;
var GildedRose = /** @class */ (function () {
    function GildedRose(itemProvider) {
        this.itemProvider = itemProvider;
    }
    GildedRose.prototype.updateQuality = function () {
        var items = this.itemProvider.get();
        items.forEach(function (item) {
            if (item.name !== "Sulfuras, Hand of Ragnaros") {
                item.updateQuality();
                // Decrease sellIn by 1
                item.updateSellIn();
                // If sellIn has passed
                if (item.sellIn < 0) {
                    item.updateQualityWhenPassedSellIn();
                }
            }
        });
        return items;
    };
    return GildedRose;
}());
exports.GildedRose = GildedRose;
