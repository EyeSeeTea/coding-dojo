"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackstageItem = void 0;
var Item_1 = require("../Item/Item");
var BackstageItem = /** @class */ (function (_super) {
    __extends(BackstageItem, _super);
    function BackstageItem(sellIn, quality) {
        return _super.call(this, "Backstage passes to a TAFKAL80ETC concert", sellIn, quality) || this;
    }
    BackstageItem.prototype.updateQuality = function () {
        // Quality never more than 50
        if (this.quality < 50) {
            // 10 days or less but more than 5 days sellIn
            if (this.sellIn < 11 && this.sellIn > 5) {
                this.quality = this.quality + 2;
                // when 5 days or less sellIn
            }
            else if (this.sellIn < 6) {
                this.quality = this.quality + 3;
                // more than 10 days sellIn
            }
            else {
                this.quality = this.quality + 1;
            }
        }
    };
    BackstageItem.prototype.updateSellIn = function () {
        this.sellIn = this.sellIn - 1;
    };
    BackstageItem.prototype.updateQualityWhenPassedSellIn = function () {
        this.quality = 0;
    };
    return BackstageItem;
}(Item_1.Item));
exports.BackstageItem = BackstageItem;
