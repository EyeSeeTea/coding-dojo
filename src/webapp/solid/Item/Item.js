"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
var Item = /** @class */ (function () {
    function Item(name, sellIn, quality) {
        this.name = name;
        this.sellIn = sellIn;
        this.quality = quality;
    }
    Item.prototype.toString = function () {
        return "Name: ".concat(this.name, " SellIn: ").concat(this.sellIn, " Quality: ").concat(this.quality);
    };
    return Item;
}());
exports.Item = Item;
