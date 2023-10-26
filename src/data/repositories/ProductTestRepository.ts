import { Product } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { FutureData } from "../api-futures";
import { ProductWithPaging } from "../../domain/entities/ProductWithPaging";
import { Future } from "../../domain/entities/generic/Future";

export class ProductTestRepository implements ProductRepository {
    getById(id: string): FutureData<Product> {
        return Future.success(
            new Product({
                id,
                imageUrl: "",
                quantity: 1,
                title: "",
            })
        );
    }
    getAll(): FutureData<ProductWithPaging> {
        return Future.success({
            pager: {
                page: 1,
                pageCount: 1,
                pageSize: 10,
                total: 100,
            },
            products: [],
        });
    }
    save(): FutureData<Product> {
        return Future.success(
            new Product({
                id: "",
                imageUrl: "",
                quantity: 1,
                title: "",
            })
        );
    }
}
