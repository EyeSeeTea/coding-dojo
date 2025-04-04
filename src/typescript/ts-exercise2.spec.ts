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
