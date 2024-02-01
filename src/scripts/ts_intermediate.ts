// 2. Create a type that represents the lending state of a book in a library.
// Users may place holds on books when they are checked-out by other users.
// type LibraryBookState = { status: “available" } | …???...

export type LibraryBookStateADT =
    | { status: "available" }
    | { status: "checked-out"; onHold: boolean };

// caso 1: libro en biblio => status = available
// caso 2: libro prestado => status = checked-out, onHold = false
// caso 3: libro prestado y reservado => status = checked-out, onHold = true

// --------------------

// 1. Create a fully-typed generic function namedToInitials that works like this:
// namedToInitials({ id: 1, name: "Kristin Scott Thomas" })
//             // returns { id: 1, initials: “KST" }
// namedToInitials({ code: “M1", name: "Mary Cassat" })
//             // returns { code: “M1", initials: “MC" }

// function namedToInitials<?>(namedObj: ?): ? {
//   return ?
// }

type genericObj = {
    [key: string]: unknown;
};

export type NamedObj = genericObj & {
    name: string;
};

export type InitialedObj = genericObj & {
    initials: string;
};

export function namedToInitials(user: NamedObj): InitialedObj {
    const { name, ...rest } = user;
    return {
        initials: name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase())
            .join(""),
        ...rest,
    };
}

function main() {
    const namedObjArray: NamedObj[] = [
        { id: 1, name: "Kristin Scott Thomas" },
        { code: "M1", name: "Mary Cassat" },
        { attribute: { some: "", stuff: "" }, name: "Timmy" },
        { name: "marty mcfly" },
    ];

    namedObjArray.forEach(namedObj => {
        console.debug(namedToInitials(namedObj));
    });
}

main();
