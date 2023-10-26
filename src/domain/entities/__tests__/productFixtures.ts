import { User, UserRole } from "../User";
import { NamedRef } from "../Ref";
import { Product } from "../Product";

export function createProducts(): Product[] {
    return [
        new Product({
            id: "kQiwoyMXRSA",
            title: "Bag",
            image: "https://www.charleskeith.eu/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-ck-products/default/dw4aba8b25/images/hi-res/2022-L3-CK2-30781775-24-3.jpg?sw=756&sh=1008",
            quantity: 2,
            status: "active",
        }),
    ];
}
