import { Product, Quantity } from "../../domain/entities/Product";
import {
    PaginationOptions,
    ProductRepository,
    ProductView,
} from "../../domain/repositories/ProductRepository";
import { D2Api } from "../../types/d2-api";
import { FutureData } from "../api-futures";

export class ProductD2Repository implements ProductRepository {
    constructor(private api: D2Api) {}

    getAll(pagination: PaginationOptions): FutureData<ProductView[]> {
        const events$ = this.api.events.get({
            fields: eventsFields,
            program: programId,
            page: pagination.page,
            pageSize: pagination.pageSize,
            order: pagination.order,
        });

        const events = events$.map(events => events..map(event => buildProgramEvent(event)));

        const emptyPager = {
            page: 1,
            pageCount: 1,
            total: 0,
            pageSize: 10,
        };
        
        return {
            pager: data?.pager || emptyPager,
            objects: events || [],
        };
        return [];
    }
    saveProduct(product: Product): FutureData<void> {
        return this.api.events
            .getAll({
                fields: eventsFields,
                program: "x7s8Yurmj7Q",
                event: id,
            })
            .getData();
        return;
    }
}

function buildProgramEvent(event: Event): ProductView {
    return {
        id: event.event,
        title: event.dataValues.find(dv => dv.dataElement === dataElements.title)?.value || "",
        image: new URL(
            event.dataValues.find(dv => dv.dataElement === dataElements.image)?.value || ""
        ),
        quantity: new Quantity(
            +(event.dataValues.find(dv => dv.dataElement === dataElements.quantity)?.value || 0)
        ),
        isActive: Boolean(
            +(event.dataValues.find(dv => dv.dataElement === dataElements.status)?.value || 0)
        ),
    };
}

export interface Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

export interface DataValue {
    dataElement: string;
    value: string;
}

interface ProgramEvent {
    id: string;
    title: string;
    image: string;
    quantity: number;
    status: number;
}

const eventsFields = {
    event: true,
    dataValues: { dataElement: true, value: true },
    eventDate: true,
} as const;

const programId = "x7s8Yurmj7Q";

const dataElements = {
    title: "qkvNoqnBdPk",
    image: "m1yv8j2av5I",
    quantity: "PZ7qxiDlYZ8",
    status: "AUsNzRGzRuC",
};
