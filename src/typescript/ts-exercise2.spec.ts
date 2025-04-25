import { Codec, string } from "purify-ts";

/* Exercise: "as" castings can be safe (up-casting) or unsafe (down-casting) */

export type Person = {
    name: string;
    occupation: string;
};

type User = Person & {
    username: string;
};

const person1: Person = { name: "Mary", occupation: "Painter" };
const person2: Person = { name: "John", occupation: "Sculptor" };

const user: User = { name: "Mary", occupation: "Painter", username: "marypainter" };

// type safe (upcasting)
const _person = user as Person;

const _users = [person1, person2].map<User>(person => {
    // type unsafe (downcasting)
    return person as User;
});

/* 
EXERCISE: The previous snippet (`const users = ...`) is not type-safe. 

1) Explain why.
 - upcasting: a User can be a Person because it has all the properties of a Person
 - downcasting: a Person cannot be a User because it does not have all the properties, User is extending Person with property username


2) Refactor it in as many ways as you can think of to make it type-safe. Hint: There are multiple
   ways to do it, aim for at least three, and rank them by your preference.
*/

// https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
function isUser(value: unknown): value is User {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const hasNameProperty = "name" in value && typeof value.name === "string";
    const hasOccupationProperty = "occupation" in value && typeof value.occupation === "string";
    const hasUsernameProperty = "username" in value && typeof value.username === "string";

    return hasNameProperty && hasOccupationProperty && hasUsernameProperty;
}

test("1. Using type predicates", () => {
    const person1: Person = { name: "Mary", occupation: "Painter" };
    const person2: Person = { name: "John", occupation: "Sculptor" };

    const users = [person1, person2].filter(isUser).map<User>((person): User => person);
    expect(users).toEqual([]);
});

const userCodec = Codec.interface({
    name: string,
    occupation: string,
    username: string,
});

function isUserUsingCodec(value: unknown): value is User {
    const maybeUser = userCodec.decode(value);
    return maybeUser.isRight();
}

test("2. Using Codec", () => {
    const person1: Person = { name: "Mary", occupation: "Painter" };
    const person2: Person = { name: "John", occupation: "Sculptor" };

    const users = [person1, person2].filter(isUserUsingCodec).map<User>((person): User => person);
    expect(users).toEqual([]);
    expect(users).toEqual([]);
});

// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
function assertIsUser(value: unknown): asserts value is User {
    if (!isUser(value)) {
        throw new Error("Not a User");
    }
}

test("3. Using assertion", () => {
    const person1: Person = { name: "Mary", occupation: "Painter" };
    const person2: Person = { name: "John", occupation: "Sculptor" };

    expect(() => {
        [person1, person2].map<User>((person): User => {
            assertIsUser(person);
            return person;
        });
    }).toThrowError("Not a User");
});

// function createUserFromPerson(person: Person): User {
//     return {
//         ...person,
//         username: `${person.name.toLowerCase()}${person.occupation.toLowerCase()}`,
//     };
// }

// test("4. Create User from Person", () => {
//     const person1: Person = { name: "Mary", occupation: "Painter" };
//     const person2: Person = { name: "John", occupation: "Sculptor" };

//     const users: User[] = [person1, person2].map<User>((person): User => {
//         return !isUser(person) ? createUserFromPerson(person) : person;
//     });

//     expect(users).toEqual([
//         { name: "Mary", occupation: "Painter", username: "marypainter" },
//         { name: "John", occupation: "Sculptor", username: "johnsculptor" },
//     ]);
// });
