import { D2EventToPost } from "@eyeseetea/d2-api";
import { PaginatedObjects, Paging, Sorting } from "../../domain/entities/Pagination";
import { Product, getProductStatus } from "../../domain/entities/Product";
import { Future } from "../../domain/entities/generic/Future";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";

export const dataElements = {
    title: "qkvNoqnBdPk",
    image: "m1yv8j2av5I",
    quantity: "PZ7qxiDlYZ8",
    status: "AUsNzRGzRuC",
};

const emptyPager = {
    page: 1,
    pageCount: 1,
    total: 0,
    pageSize: 10,
};

export class ProductD2Repository implements ProductRepository {
    constructor(private api: D2Api) {}

    public get(id: string): FutureData<Product> {
        return apiToFuture(
            this.api.events.getAll({
                fields: eventsFields,
                program: "x7s8Yurmj7Q",
                event: id,
            })
        ).map(d2Events => {
            const event = d2Events?.events[0];
            const product = this.buildProduct(event as D2Event);
            return product;
        });
    }

    public getList(
        paging: Paging,
        sorting: Sorting<Product>
    ): FutureData<PaginatedObjects<Product>> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                program: "x7s8Yurmj7Q",
                page: paging.page,
                pageSize: paging.pageSize,
                order: `${sorting.field}:${sorting.order}`,
            })
        ).map(d2Events => {
            const products = d2Events.events.map(this.buildProduct);
            return {
                objects: products || [],
                pager: d2Events.pager || emptyPager,
            };
        });
    }

    public update(product: Product): FutureData<string> {
        return apiToFuture(
            this.api.events.getAll({
                fields: { $all: true },
                program: "x7s8Yurmj7Q",
                event: product.id,
            })
        ).flatMap(d2Events => {
            const editingD2Event = d2Events.events[0];

            if (!editingD2Event) return Future.success("Product not found");

            const d2Event = this.fromProductToD2Event(product, editingD2Event);

            return apiToFuture(this.api.events.post({}, { events: [d2Event] })).flatMap(
                response => {
                    return Future.success(response.status);
                }
            );
        });
    }

    private buildProduct(event: D2Event): Product {
        return {
            id: event.event,
            title: event.dataValues.find(dv => dv.dataElement === dataElements.title)?.value || "",
            image: event.dataValues.find(dv => dv.dataElement === dataElements.image)?.value || "",
            quantity: +(
                event.dataValues.find(dv => dv.dataElement === dataElements.quantity)?.value || 0
            ),
            status: getProductStatus(
                +(event.dataValues.find(dv => dv.dataElement === dataElements.quantity)?.value || 0)
            ),
        };
    }

    private fromProductToD2Event(product: Product, event: D2EventToPost): D2EventToPost {
        return {
            ...event,
            dataValues: event?.dataValues.map(dv => {
                if (dv.dataElement === dataElements.quantity) {
                    return { ...dv, value: product.quantity.toString() };
                } else if (dv.dataElement === dataElements.status) {
                    return { ...dv, value: product.quantity === 0 ? "0" : "1" };
                } else {
                    return dv;
                }
            }),
        };
    }
}

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

interface D2Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

interface DataValue {
    dataElement: string;
    value: string;
}
