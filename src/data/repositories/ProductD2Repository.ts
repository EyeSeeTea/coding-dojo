import { PaginatedObjects } from "@eyeseetea/d2-api/api";
import { Event } from "../../domain/entities/Product";
import { ProductOptions, ProductRepository } from "../../domain/repositories/ProductRepository";
import { D2Api } from "../../types/d2-api";
import { FutureData, apiToFuture } from "../api-futures";
import { D2Event, D2EventToPost } from "@eyeseetea/d2-api/api/events";

export class ProductD2Repository implements ProductRepository {
    constructor(private api: D2Api) {}

    public getProductList(options: ProductOptions): FutureData<PaginatedObjects<Event>> {
        const { paging, sorting } = options;

        return apiToFuture(
            this.api.events.get({
                fields: eventsFields,
                program: programId,
                page: paging.page,
                pageSize: paging.pageSize,
                order: `${sorting.field}:${sorting.direction}`,
            })
        ).map(event => {
            const { pager, events } = event;

            return { objects: events, pager };
        });
    }

    public save(d2EventToPost: D2EventToPost): FutureData<boolean> {
        return apiToFuture(this.api.events.post({}, { events: [d2EventToPost] })).map(res => {
            return res.status === "OK";
        });
    }

    public getAllEvents(eventId: string | undefined): FutureData<D2Event[]> {
        return apiToFuture(
            this.api.events
                .getAll({
                    fields: { $all: true },
                    program: programId,
                    event: eventId,
                })
                .map(event => {
                    return event.data.events;
                })
        );
    }
}

const programId = "x7s8Yurmj7Q";

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;
