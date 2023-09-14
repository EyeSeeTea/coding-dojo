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
exports.BrieItem = void 0;
var Item_1 = require("../Item/Item");
var BrieItem = /** @class */ (function (_super) {
    __extends(BrieItem, _super);
    function BrieItem(sellIn, quality) {
        return _super.call(this, "Aged Brie", sellIn, quality) || this;
    }
    BrieItem.prototype.updateQuality = function () {
        // Quality never more than 50
        if (this.quality < 50) {
            this.quality = this.quality + 1;
        }
    };
    BrieItem.prototype.updateSellIn = function () {
        this.sellIn = this.sellIn - 1;
    };
    BrieItem.prototype.updateQualityWhenPassedSellIn = function () {
        // Quality never more than 50
        if (this.quality < 50) {
            this.quality = this.quality + 1;
        }
    };
    return BrieItem;
}(Item_1.Item));
exports.BrieItem = BrieItem;
