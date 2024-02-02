type NamedObject<T extends string | number> = {
    [key: string]: T;
};

function namedToInitials<T extends string | number>(
    namedObj: NamedObject<T>
): NamedObject<T | string> {
    if (!namedObj.name) {
        return { ...namedObj };
    }

    const initials: string = (namedObj.name as string)
        .split(" ")
        .map((name: string) => name.charAt(0).toUpperCase())
        .join("");

    delete namedObj.name;

    return { ...namedObj, initials };
}

// Example usage:
const result1 = namedToInitials({ id: 1, name: "Kristin Scott Thomas" });
console.log(result1); // Output: { id: 1,  initials: "KST" }

const result2 = namedToInitials({ code: "M1", name: "Mary Cassat" });
console.log(result2); // Output: { code: "M1", initials: "MC" }

const result3 = namedToInitials({ id: 2, code: "M2" });
console.log(result2); // Output: {id: 2, code: "M2"}

type LibraryBookState =
    | { status: "available" }
    | { status: "checked out"; dueDate: Date; isOnHold: boolean };
