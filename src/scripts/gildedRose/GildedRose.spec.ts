import { GildedRose, Item, ItemInMemoryProvider } from "./GildedRoseKata";

describe("GildedRose Suite Script", () => {
    it("Sell in value should be decreased", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("whatever", 10, 0)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].sellIn).toBe(9);
    });

    it("Quality value should be decreased", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("whatever", 1, 10)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(9);
    });

    it("Quality value decreases twice as much when sell by is passed", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("whatever", 0, 10)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(8);
    });

    it("Quality is never negative", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("whatever", 0, 0)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(0);
    });

    it("Aged brie increases quality with age", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("Aged Brie", 0, 0)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(2);
    });

    it("Qualify never increases past fifty", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("Aged Brie", 5, 50)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(50);
    });

    it("Sulfuras never changes", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("Sulfuras, Hand of Ragnaros", 0, 80)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(80);
        expect(items[0].sellIn).toBe(0);
    });

    it("Backstage pass increases quality by one if sell by greater than ten", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("Backstage passes to a TAFKAL80ETC concert", 11, 20)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(21);
    });

    it("Backstage pass increases quality by two if sell by smaller than ten", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("Backstage passes to a TAFKAL80ETC concert", 6, 20)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(22);
    });

    it("Backstage pass increases quality by three if sell by smaller than five", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("Backstage passes to a TAFKAL80ETC concert", 4, 20)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(23);
    });

    it("Backstage pass loses value after sell by passes", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("Backstage passes to a TAFKAL80ETC concert", 0, 20)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(0);
    });

    it("Conjured items degrade in Quality twice as fast as normal items", () => {
        const itemProvider = new ItemInMemoryProvider([new Item("Conjured Mana Cake", 3, 6)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(4);
    });
});
