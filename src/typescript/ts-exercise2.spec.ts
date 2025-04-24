/* Exercise: "as" castings can be safe (up-casting) or unsafe (down-casting) */

import { Codec, string } from "purify-ts";
import { test } from "vitest";

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
const person = user as Person;

const users = [person1, person2].map<User>(person => {
    // type unsafe (downcasting)
    return person as User;
});

/* 
EXERCISE: The previous snippet (`const users = ...`) is not type-safe. 

1) Explain why.
2) Refactor it in as many ways as you can think of to make it type-safe. Hint: There are multiple
   ways to do it, aim for at least three, and rank them by your preference.
*/

/*
1) This downcast is unsafe because a Person does not have a username property. 
With "as" we are telling the TypeScript compiler the `person` is a User, but we are not guaranteeing it. 
The person may not be a User, missing required User props such as username.
If we later use this user, we may get a runtime error when we try to access the username property.
*/

/*
2) Without making changes to original types and examples, ordered by preference:
*/

// 2.a) type-guard using Codec
const userCodec = Codec.interface({
    name: string,
    occupation: string,
    username: string,
});
// export the type here using GetType to avoid duplication
// export type User = Codec.GetType<typeof userCodec>;

function isUser_2a(person: Person): person is User {
    return userCodec.decode(person).isRight();
}

test("throws because person is not a User", () => {
    expect(() => {
        const users_2a = [person1, person2].map<User>(person => {
            if (!isUser_2a(person)) {
                throw new Error(`Person ${person.name} is not a User`);
            }
            return person;
        });
    }).toThrowError();
});

// 2.b) type-guard + assert
// similar to above example but leveraging assert
function assertIsUser(person: Person): asserts person is User {
    if (!isUser_2a(person)) {
        throw new Error(`Person ${person.name} is not a User`);
    }
}

test("throws because person is not a User", () => {
    expect(() => {
        const users_2b = [person1, person2].map<User>(person => {
            assertIsUser(person);
            return person;
        });
    }).toThrowError();
});

// 2.c) type-guard using "in" operator
function isUser_2c(person: Person): person is User {
    // if we used classes, we could use the `instanceof` operator, that would be much better
    // return person instanceof User;

    // but here we need to check the object by hand
    return "username" in person && typeof person.username === "string";
    // Downside: this needs to stay in sync with any Type changes. Cover extra cases if the User type changes
    // for example, if we add the "roles" property to User,
    // then we need to update this function to also check for the "roles" prop:
    //  return "username" in person && "roles" in person;
    // Otherwise it will be wrongly returning true for a Person with "username" but without "roles"
}

test("throws because person is not a User", () => {
    expect(() => {
        const users_2c = [person1, person2].map<User>(person => {
            if (!isUser_2c(person)) {
                throw new Error(`Person ${person.name} is not a User`);
            }
            return person;
        });
    }).toThrowError();
});
