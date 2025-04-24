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
    - The `users` array is being created by mapping over an array of `person` objects and casting each `person` to a `user`. 
    - The `person` type does not have the `username` property existing in the `user` type. 

2) Refactor it in as many ways as you can think of to make it type-safe. Hint: There are multiple
   ways to do it, aim for at least three, and rank them by your preference.
*/

function buildUsernameFromPerson(person: Person): string {
    return `${person.name.toLowerCase()}${person.occupation.toLowerCase()}`;
}

// 1. Create valid users in the mapping
const users1 = [person1, person2].map<User>(person => ({
    ...person,
    username: buildUsernameFromPerson(person),
}));

// 2. Convert person objects to user objects
function toUser(person: Person): User {
    if ("username" in person) return person as User;
    return {
        ...person,
        username: buildUsernameFromPerson(person),
    };
}
const users2 = [person1, person2].map<User>(toUser);

// 3. Check if the person is a user and return only valid users
function isUser(person: Person): person is User {
    return "username" in person;
}
const users3 = [person1, person2].filter(isUser);
