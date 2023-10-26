import { Event, ProgramEvent } from "../../../domain/entities/Product";

interface ProductViewModel {
    title: string;
    image: string;
    quantity: string;
    status: string;
}

export function buildProgramEvent(event: Event, dataElements: ProductViewModel): ProgramEvent {
    return {
        id: event.event,
        title: event.dataValues.find(dv => dv.dataElement === dataElements.title)?.value || "",
        image: event.dataValues.find(dv => dv.dataElement === dataElements.image)?.value || "",
        quantity: +(
            event.dataValues.find(dv => dv.dataElement === dataElements.quantity)?.value || 0
        ),
        status: +(event.dataValues.find(dv => dv.dataElement === dataElements.status)?.value || 0),
    };
}
