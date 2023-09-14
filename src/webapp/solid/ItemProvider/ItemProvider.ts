import { UpdatableItem } from "../UpdatableItem/UpdatableItem";
import { SulfurasItem } from "../items/SulfurasItem";

export interface ItemProviderRepository {
    get(): (UpdatableItem | SulfurasItem)[];
}
