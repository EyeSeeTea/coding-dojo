import { BackstageItem } from "../entities/BackstageItem";
import { BasicItem } from "../entities/BasicItem";
import { BrieItem } from "../entities/BrieItem";
import { ConjuredItem } from "../entities/ConjuredItem";

export interface Updatable {
    updateQuality(): void;
    updateSellIn(): void;
    updateQualityWhenPassedSellIn(): void;
}

export type UpdatableItem = BasicItem | BrieItem | ConjuredItem | BackstageItem;
