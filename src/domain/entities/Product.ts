import { Struct } from "./generic/Struct";
import { Ref } from "./Ref";

type Url = string;
export type ProductStatus = "active" | "inactive";

export interface ProductAttrs extends Ref {
    title: string;
    quantity: number;
    imageUrl: Url;
}

export class Product extends Struct<ProductAttrs>() {
    public readonly status: ProductStatus;

    constructor(data: ProductAttrs) {
        super(data);
        this.status = this.getStatus(data.quantity);
    }

    update(quantity: number): Product {
        return {
            ...this,
            quantity,
            status: this.getStatus(quantity),
        };
    }

    getStatus(quantity: number): ProductStatus {
        return Product.isValidNumber(quantity) && Product.isPositiveNumber(quantity) && quantity > 0
            ? "active"
            : "inactive";
    }

    static isPositiveNumber(quantity: number): boolean {
        return quantity >= 0;
    }

    static isValidNumber(quantity: number): boolean {
        return !isNaN(quantity);
    }
}
