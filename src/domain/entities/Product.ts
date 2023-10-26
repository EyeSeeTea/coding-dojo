export interface ProgramEvent {
    id: string;
    title: string;
    image: string;
    quantity: number;
    status: number;
}

export type ProductStatus = "active" | "inactive";

export interface Event {
    event: string;
    dataValues: DataValue[];
    eventDate: string;
}

export interface DataValue {
    dataElement: string;
    value: string;
}
