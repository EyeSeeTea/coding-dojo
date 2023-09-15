import { UpdatableItem } from "./UpdatableItem";
import { SulfurasItem } from "../entities/SulfurasItem";

export interface ItemProviderRepository {
    get(): (UpdatableItem | SulfurasItem)[];
}
