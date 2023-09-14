import { BackstageItem } from "../items/BackstageItem";
import { BasicItem } from "../items/BasicItem";
import { BrieItem } from "../items/BrieItem";
import { ConjuredItem } from "../items/ConjuredItem";

export interface Updatable {
    updateQuality(): void;
    updateSellIn(): void;
    updateQualityWhenPassedSellIn(): void;
}

export type UpdatableItem = BasicItem | BrieItem | ConjuredItem | BackstageItem;
