export type ProductStatus = "active" | "inactive";

export interface Product {
    id: string;
    title: string;
    image: string;
    quantity: number;
    status: ProductStatus;
}
