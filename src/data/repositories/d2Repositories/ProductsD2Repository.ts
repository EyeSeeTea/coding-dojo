import { Pager } from "@eyeseetea/d2-api/api";
import { Future } from "../../../domain/entities/generic/Future";
import { Product } from "../../../domain/entities/Product";
import { ProductsRepository } from "../../../domain/repositories/ProductsRepository";
import { D2Api } from "../../../types/d2-api";
import { apiToFuture, FutureData } from "../../api-futures";
import { Event } from "../../entities/Event";

export class ProductsD2Repository implements ProductsRepository {
    constructor(private api: D2Api) {}

    getProduct(id: string): FutureData<Product> {
        return apiToFuture(
            this.api.events.get({ fields: eventsFields, program: "x7s8Yurmj7Q", event: id })
        ).flatMap(d2Event => {
            //Since we filtered by id, there should be only one event in response.
            const evt = d2Event.events.at(0);
            if (evt) {
                const res = this.buildProduct(evt);
                return Future.success(res);
            } else {
                return Future.error(new Error("Could not find product"));
            }
        });
    }

    getProducts(
        page: number,
        pageSize: number,
        sortingField: string,
        sortingOrder: "asc" | "desc"
    ): FutureData<{ pager: Pager; objects: Product[] }> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                program: "x7s8Yurmj7Q",
                page: page,
                pageSize: pageSize,
                order: `${sortingField}:${sortingOrder}`,
            })
        ).map(d2Events => {
            const products = d2Events.events.map(evt => this.buildProduct(evt));
            return { pager: d2Events.pager, objects: products };
        });
    }

    saveProduct(product: Product): FutureData<void> {
        return apiToFuture(
            this.api.events.get({
                fields: { $all: true },
                program: "x7s8Yurmj7Q",
                event: product.id,
            })
        ).flatMap(d2Event => {
            //Since we filtered by id, there should be only one event in response.
            const evt = d2Event.events.at(0);
            if (evt) {
                const updatedD2Event = {
                    ...evt,
                    dataValues: evt?.dataValues.map(dv => {
                        if (dv.dataElement === dataElements.quantity) {
                            return { ...dv, value: product.quantity };
                        } else if (dv.dataElement === dataElements.status) {
                            return { ...dv, value: product.status === "active" ? 1 : 0 };
                        } else {
                            return dv;
                        }
                    }),
                };
                return apiToFuture(this.api.events.post({}, { events: [updatedD2Event] })).flatMap(
                    res => {
                        if (res.status === "OK") return Future.success(undefined);
                        else return Future.error(new Error("Could not update product"));
                    }
                );
            } else {
                return Future.error(new Error("Could not update product"));
            }
        });
    }

    private buildProduct(event: Event): Product {
        const evtQty = +(
            event.dataValues.find(dv => dv.dataElement === dataElements.quantity)?.value || 0
        );
        return {
            id: event.event,
            title: event.dataValues.find(dv => dv.dataElement === dataElements.title)?.value || "",
            image: event.dataValues.find(dv => dv.dataElement === dataElements.image)?.value || "",
            quantity: evtQty,
            status: evtQty > 0 ? "active" : "inactive",
        };
    }
}

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

//TO DO - how to relate data value to property of prodict
const dataElements = {
    title: "qkvNoqnBdPk",
    image: "m1yv8j2av5I",
    quantity: "PZ7qxiDlYZ8",
    status: "AUsNzRGzRuC",
};
