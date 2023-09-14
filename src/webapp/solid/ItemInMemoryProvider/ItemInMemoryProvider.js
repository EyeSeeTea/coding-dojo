"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemInMemoryProvider = void 0;
var ItemInMemoryProvider = /** @class */ (function () {
    function ItemInMemoryProvider(items) {
        this.items = items;
    }
    ItemInMemoryProvider.prototype.get = function () {
        return this.items;
    };
    return ItemInMemoryProvider;
}());
exports.ItemInMemoryProvider = ItemInMemoryProvider;
