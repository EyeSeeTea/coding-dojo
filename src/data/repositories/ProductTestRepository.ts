import { PaginatedObjects } from "@eyeseetea/d2-api/2.36";
import { Future } from "../../domain/entities/generic/Future";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { FutureData } from "../api-futures";
import { Event } from "../../domain/entities/Product";
import { D2Event } from "@eyeseetea/d2-api/api/events";

const emptyPager = {
    page: 1,
    pageCount: 1,
    total: 0,
    pageSize: 10,
};

export class ProductTestRepository implements ProductRepository {
    public getProductList(): FutureData<PaginatedObjects<Event>> {
        return Future.success({ objects: [], pager: emptyPager });
    }
    public getAllEvents(): FutureData<D2Event[]> {
        return Future.success([]);
    }
    public save(): FutureData<boolean> {
        return Future.success(true);
    }
}
