import { GildedRose } from "../GildedRose";
import { ItemInMemoryProvider } from "../../usecases/ItemInMemoryProvider";
import { BackstageItem } from "../BackstageItem";
import { BasicItem } from "../BasicItem";
import { BrieItem } from "../BrieItem";
import { ConjuredItem } from "../ConjuredItem";
import { SulfurasItem } from "../SulfurasItem";

describe("GildedRose Suite Ana", () => {
    it("Sell in value should be decreased", () => {
        const itemProvider = new ItemInMemoryProvider([new BasicItem("whatever", 10, 0)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].sellIn).toBe(9);
    });

    it("Quality value should be decreased", () => {
        const itemProvider = new ItemInMemoryProvider([new BasicItem("whatever", 1, 10)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(9);
    });

    it("Quality value decreases twice as much when sell by is passed", () => {
        const itemProvider = new ItemInMemoryProvider([new BasicItem("whatever", 0, 10)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(8);
    });

    it("Quality is never negative", () => {
        const itemProvider = new ItemInMemoryProvider([new BasicItem("whatever", 0, 0)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(0);
    });

    it("Aged brie increases quality with age", () => {
        const itemProvider = new ItemInMemoryProvider([new BrieItem(0, 0)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(2);
    });

    it("Qualify never increases past fifty", () => {
        const itemProvider = new ItemInMemoryProvider([new BrieItem(5, 50)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(50);
    });

    it("Sulfuras never changes", () => {
        const itemProvider = new ItemInMemoryProvider([new SulfurasItem()]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(80);
        expect(items[0].sellIn).toBe(0);
    });

    it("Backstage pass increases quality by one if sell by greater than ten", () => {
        const itemProvider = new ItemInMemoryProvider([new BackstageItem(11, 20)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(21);
    });

    it("Backstage pass increases quality by two if sell by smaller than ten and greater than 5", () => {
        const itemProvider = new ItemInMemoryProvider([new BackstageItem(6, 20)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(22);
    });

    it("Backstage pass increases quality by three if sell by smaller than 6", () => {
        const itemProvider = new ItemInMemoryProvider([new BackstageItem(4, 20)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(23);
    });

    it("Backstage pass loses value after sell by passes", () => {
        const itemProvider = new ItemInMemoryProvider([new BackstageItem(0, 20)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(0);
    });

    it("Conjured Mana Cake items degrade in Quality twice as fast as normal items", () => {
        const itemProvider = new ItemInMemoryProvider([new ConjuredItem(5, 20)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(18);
    });

    it("Conjured Mana Cake items that passed sell in date degrade in Quality twice as fast as normal items", () => {
        const itemProvider = new ItemInMemoryProvider([new ConjuredItem(0, 20)]);

        const gildedRose = new GildedRose(itemProvider);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).toBe(16);
    });
});
