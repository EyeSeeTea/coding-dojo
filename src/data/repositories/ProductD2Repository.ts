import { D2Api } from "../../types/d2-api";

import { Product } from "../../domain/entities/Product";
import {
    ProductGetAllOptions,
    ProductRepository,
} from "../../domain/repositories/ProductRepository";
import { FutureData, apiToFuture } from "../api-futures";
import { ProductWithPaging } from "../../domain/entities/ProductWithPaging";
import { Future } from "../../domain/entities/generic/Future";
import { Id } from "../../domain/entities/Ref";
import { D2EventToPost } from "@eyeseetea/d2-api";

const dataElements = {
    title: "qkvNoqnBdPk",
    image: "m1yv8j2av5I",
    quantity: "PZ7qxiDlYZ8",
    status: "AUsNzRGzRuC",
};

const PROGRAM_ID = "x7s8Yurmj7Q";

export class ProductD2Repository implements ProductRepository {
    constructor(private api: D2Api) {}

    getById(id: string): FutureData<Product> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                program: PROGRAM_ID,
                event: id,
            })
        ).flatMap(d2Response => {
            const firstEvent = d2Response.events[0];
            if (!firstEvent) return Future.error(new Error(`Cannot find product: ${id}`));
            const product = this.buildProduct(firstEvent);
            return Future.success(product);
        });
    }

    getAll(options: ProductGetAllOptions): FutureData<ProductWithPaging> {
        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                program: PROGRAM_ID,
                page: options.page,
                pageSize: options.pageSize,
            })
        ).map(d2Response => {
            const products = d2Response.events.map(event => this.buildProduct(event));
            return {
                products,
                pager: d2Response.pager,
            };
        });
    }

    save(product: Product): FutureData<Product> {
        return apiToFuture(
            this.api.events.get({
                fields: {
                    $all: true,
                },
                program: PROGRAM_ID,
                event: product.id,
            })
        ).flatMap(d2Response => {
            const existingEvent = d2Response.events[0] as D2EventToPost;
            if (!existingEvent)
                return Future.error(new Error(`Cannot find product: ${product.id}`));

            const eventToSave = {
                ...existingEvent,
                event: product.id,
                dataValues: existingEvent.dataValues.map(dv => {
                    if (dv.dataElement === dataElements.quantity) {
                        return { ...dv, value: product.quantity };
                    } else if (dv.dataElement === dataElements.status) {
                        return { ...dv, value: product.status === "active" ? 1 : 0 };
                    } else {
                        return dv;
                    }
                }),
            };

            return apiToFuture(
                this.api.events.post(
                    {},
                    {
                        events: [eventToSave],
                    }
                )
            ).flatMap(d2Response => {
                if (d2Response.status === "ERROR")
                    return Future.error(new Error(`Error saving event: ${d2Response.message}`));
                return Future.success(product);
            });
        });
    }

    private buildProduct(event: D2Event): Product {
        const imageUrl = `${this.api.baseUrl}/api/events/files?dataElementUid=${dataElements.image}&eventUid=${event.event}`;

        return new Product({
            id: event.event,
            imageUrl,
            title: event.dataValues.find(dv => dv.dataElement === dataElements.title)?.value || "",
            quantity: +(
                event.dataValues.find(dv => dv.dataElement === dataElements.quantity)?.value || 0
            ),
        });
    }
}

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

type D2Event = {
    event: Id;
    dataValues: {
        dataElement: Id;
        value: string;
    }[];
    eventDate: string;
};
