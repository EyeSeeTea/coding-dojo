import { Product } from "./Product";

export type ProductWithPaging = {
    products: Product[];
    pager: {
        page: number;
        pageCount: number;
        total: number;
        pageSize: number;
    };
};
