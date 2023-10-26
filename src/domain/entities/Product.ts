import { Struct } from "./generic/Struct";
import { NamedRef } from "./Ref";

type Id = string;
type ImageURL = string;
export type ProductStatus = "active" | "inactive";

export interface ProductAttrs {
    id: Id;
    title: string;
    image: ImageURL;
    quantity: number;
    status: ProductStatus;
}

export class Product extends Struct<ProductAttrs>() {
    updateQuantity(value: number): void {
        this.quantity = value;
    }
    /* belongToUserGroup(userGroupUid: string): boolean {
        return this.userGroups.some(({ id }) => id === userGroupUid);
    }

    isAdmin(): boolean {
        return this.userRoles.some(({ authorities }) => authorities.includes("ALL"));
    } */
}
