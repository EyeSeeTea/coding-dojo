import { D2Event } from "@eyeseetea/d2-api";
import { Product, ProductStatus } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { D2Api } from "../../types/d2-api";
import { apiToFuture, FutureData } from "../api-futures";

const PROGRAM_ID = "x7s8Yurmj7Q";
const dataElements = {
    title: "qkvNoqnBdPk",
    image: "m1yv8j2av5I",
    quantity: "PZ7qxiDlYZ8",
    status: "AUsNzRGzRuC",
};

export class ProductD2Repository implements ProductRepository {
    constructor(private api: D2Api) {}

    public getProducts(): FutureData<Product[]> {
        return apiToFuture(
            this.api.events.getAll({
                fields: {
                    $all: true,
                },
                program: PROGRAM_ID,
            })
        ).map(response => {
            return this.buildProducts(response.events);
        });
    }

    public saveProduct(product: Product): FutureData<void> {
        return apiToFuture(
            this.api.events.get({
                fields: {
                    $all: true,
                },
                event: product.id,
            })
        ).map(response => {
            const event = response.events[0];
            if (event) {
                const d2Event: D2Event = {
                    ...event,
                    dataValues: event.dataValues.map(dv => {
                        if (dv.dataElement === dataElements.quantity) {
                            return { ...dv, value: product.quantity.toString() };
                        } else if (dv.dataElement === dataElements.status) {
                            return { ...dv, value: product.status };
                        } else {
                            return dv;
                        }
                    }),
                };
                apiToFuture(this.api.events.post({}, { events: [d2Event] }));
            }
        });
    }

    private buildProducts(events: D2Event[]): Product[] {
        return events.map(event => {
            const id = event.event;
            const title =
                event.dataValues.find(dv => dv.dataElement === dataElements.title)?.value || "";
            const image =
                event.dataValues.find(dv => dv.dataElement === dataElements.image)?.value || "";
            const quantity =
                event.dataValues.find(dv => dv.dataElement === dataElements.quantity)?.value || "";
            const statusValue =
                event.dataValues.find(dv => dv.dataElement === dataElements.status)?.value || "";

            const status: ProductStatus = parseInt(statusValue) === 0 ? "inactive" : "active";

            return new Product({
                id,
                title,
                image: image
                    ? `${this.api.baseUrl}/api/events/files?dataElementUid=${dataElements.image}&eventUid=${event.event}`
                    : "",
                quantity: parseInt(quantity),
                status,
            });
        });
    }
}
