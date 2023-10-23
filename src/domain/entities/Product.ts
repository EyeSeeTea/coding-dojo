export interface Product {
    title: string;
    image: URL;
    quantity: Quantity;
    isActive: boolean;
}

export class Quantity {
    value;
    constructor(value: number) {
        if (value < 0) throw Error("Quantity cannot be lower than zero");
        this.value = value;
    }
}
