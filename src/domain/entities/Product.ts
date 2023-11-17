export type ProductStatus = "active" | "inactive";

export interface Product {
    id: string;
    title: string;
    image: string;
    quantity: number;
    status: ProductStatus;
}

export function getProductStatus(quantity: number): ProductStatus {
    return quantity === 0 ? "inactive" : "active";
}

export function isQuantityValid(quantity: number): boolean {
    const isValidNumber = !isNaN(quantity);
    return isValidNumber && quantity >= 0;
}
