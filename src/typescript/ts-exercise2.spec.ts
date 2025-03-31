export type Person = {
    name: string;
    occupation: string;
};

type User = Person & {
    username: string;
};

const person1: Person = { name: "Mary", occupation: "Painter" };
const person2: Person = { name: "John", occupation: "Sculptor" };

// @ts-expect-error
const users = [person1, person2].map(person => {
    return person as User;
});

/* 
EXERCISE: The previous snippet (`const users = ...`) is not type-safe. 

1) Explain why.
2) Refactor it in as many ways as you can think of to make the tag @ts-expect-error confirm there is an error.

Hint: There are multiple ways to do it, aim for at least three, and rank them by your preference.
*/
