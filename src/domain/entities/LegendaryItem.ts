import { Item } from "./Item";

export class LegendaryItem extends Item {
    constructor(name: string, sellIn: number) {
        super(name, sellIn, 80);
    }
}
