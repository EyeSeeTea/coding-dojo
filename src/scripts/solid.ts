import { GildedRose, Item, ItemInMemoryProvider } from "../domain/entities/Items";

function main() {
    const itemProvider = new ItemInMemoryProvider([
        new Item("+5 Dexterity Vest", 10, 20),
        new Item("Aged Brie", 2, 0),
        new Item("Elixir of the Mongoose", 5, 7),
        new Item("Sulfuras, Hand of Ragnaros", 0, 80),
        new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
        new Item("Conjured Mana Cake", 3, 6),
    ]);

    const gildedRose = new GildedRose(itemProvider);

    const items = gildedRose.updateQuality();

    console.log(items.map(item => item.toString()).join("\n"));
}

main();
