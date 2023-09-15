/*
Hi and welcome to modified Gilded Rose kata version. 

The goal is practice SOLID Principles refactoring this code.

As you know, we are a small inn with a prime location in a prominent city ran by a friendly innkeeper named Allison.
We also buy and sell only the finest goods. Unfortunately, our goods are constantly degrading in quality as they approach their sell by date.
We have a system in place that updates our inventory for us. It was developed by a no-nonsense type named Leeroy, who has moved on to new adventures. 
Your task is to add the new feature to our system so that we can begin selling a new category of items. First an introduction to our system:

All items have a SellIn value which denotes the number of days we have to sell the item
All items have a Quality value which denotes how valuable the item is
At the end of each day our system lowers both values for every item
Pretty simple, right? Well this is where it gets interesting:

Once the sell by date has passed, Quality degrades twice as fast
The Quality of an item is never negative
"Aged Brie" actually increases in Quality the older it gets
The Quality of an item is never more than 50
"Sulfuras", being a legendary item, never has to be sold or decreases in Quality
"Backstage passes", like aged brie, increases in Quality as it's SellIn value approaches; 
   Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but Quality drops to 0 after the concert

We have recently signed a supplier of conjured items. This requires an update to our system:
    "Conjured" items degrade in Quality twice as fast as normal items

In the future we can have a provider retrieving data from dhis2. Refactor the code to minimal change would be necessary when we need to do the change

Feel free to make any changes to the previewUpdateQuality method and add any new code as long as everything still works correctly. 
However, do not alter the Item class or Items property as those belong to the goblin in the corner who will insta-rage and one-shot you as he doesn't believe in shared code ownership.

Just for clarification, an item can never have its Quality increase above 50, however "Sulfuras" is a legendary item and as such its Quality is 80 and it never alters.
*/

import { GildedRose } from "../../domain/entities/GildedRose";
import { ItemInMemoryProvider } from "../../domain/usecases/ItemInMemoryProvider";
import { BackstageItem } from "../../domain/entities/BackstageItem";
import { BasicItem } from "../../domain/entities/BasicItem";
import { BrieItem } from "../../domain/entities/BrieItem";
import { ConjuredItem } from "../../domain/entities/ConjuredItem";
import { SulfurasItem } from "../../domain/entities/SulfurasItem";

function main() {
    const itemProvider = new ItemInMemoryProvider([
        new BasicItem("+5 Dexterity Vest", 10, 20),
        new BrieItem(2, 0),
        new BasicItem("Elixir of the Mongoose", 5, 7),
        new SulfurasItem(),
        new BackstageItem(15, 20),
        new ConjuredItem(3, 6),
    ]);

    const gridedRose = new GildedRose(itemProvider);

    const updatedItems = gridedRose.updateQuality();

    console.debug(updatedItems.map(item => item.toString()).join("\n"));
}

main();
