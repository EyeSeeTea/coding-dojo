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
