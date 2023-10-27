import { Id } from "./Ref";

export interface Product {
    id: Id;
    title: string;
    image: string;
    quantity: number;
    status: ProductStatus;
}

export type ProductStatus = "active" | "inactive";
