import { PaginatedObjects } from "@eyeseetea/d2-api/api";
import { FutureData } from "../../data/api-futures";
import { Paging, Sorting } from "../entities/PaginatedObjects";
import { Event, ProgramEvent } from "../entities/Product";
import { D2Event, D2EventToPost } from "@eyeseetea/d2-api/api/events";

export interface ProductRepository {
    getProductList(options: ProductOptions): FutureData<PaginatedObjects<Event>>;
    getAllEvents(eventId: string | undefined): FutureData<D2Event[]>;
    save(d2EventToPost: D2EventToPost): FutureData<boolean>;
}

export interface ProductOptions {
    paging: Paging;
    sorting: Sorting<ProgramEvent>;
}
