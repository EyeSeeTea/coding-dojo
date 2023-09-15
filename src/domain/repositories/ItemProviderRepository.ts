import { GildedRoseItem } from "../entities/GildedRose";

export interface ItemProviderRepository {
    get(): GildedRoseItem[];
}
