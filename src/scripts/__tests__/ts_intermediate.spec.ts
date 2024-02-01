import { describe, it } from "vitest";
import { InitialedObj, NamedObj, namedToInitials } from "../ts_intermediate";

const namedObjArray: NamedObj[] = [
    { id: 1, name: "Kristin Scott Thomas" },
    { code: "M1", name: "Mary Cassat" },
    { attribute: { some: "", stuff: "" }, name: "Timmy" },
    { name: "marty mcfly" },
];

describe("namedToInitials", () => {
    it("Should replace name property with initials containing the initials of name", () => {
        const expectedObj: InitialedObj[] = [
            { initials: "KST", id: 1 },
            { initials: "MC", code: "M1" },
            { initials: "T", attribute: { some: "", stuff: "" } },
            { initials: "MM" },
        ];

        const initialedObjArray: InitialedObj[] = [];
        namedObjArray.forEach(namedObj => {
            initialedObjArray.push(namedToInitials(namedObj));
        });

        expect(initialedObjArray).toEqual(expectedObj);
    });
});
