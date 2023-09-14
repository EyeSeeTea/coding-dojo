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
exports.BasicItem = void 0;
var Item_1 = require("../Item/Item");
var BasicItem = /** @class */ (function (_super) {
    __extends(BasicItem, _super);
    function BasicItem(name, sellIn, quality) {
        return _super.call(this, name, sellIn, quality) || this;
    }
    BasicItem.prototype.updateQuality = function () {
        // Quality never negative
        if (this.quality > 0) {
            this.quality = this.quality - 1;
        }
    };
    BasicItem.prototype.updateSellIn = function () {
        this.sellIn = this.sellIn - 1;
    };
    BasicItem.prototype.updateQualityWhenPassedSellIn = function () {
        // Quality never negative
        if (this.quality > 0) {
            this.quality = this.quality - 1;
        }
    };
    return BasicItem;
}(Item_1.Item));
exports.BasicItem = BasicItem;
