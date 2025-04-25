/*
EXERCISE: when and how to use "satisfies" --> https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html

Check at the code below. Currently, `config` is an unrestricted object.

We want to enforce stricter typings for `config`. Refactor its definition using:

1. Define a more restrictive `Config` type.
2. Use the `satisfies` keyword.
3. ... if you can think of another way to do it, go for it!

When you're done, reflect on the differences between the different approaches.
*/

type RequestInfo = { url: string; limit: number };

// type Config = object;

// export const config: Config = {
//     users: { url: "/api/users", limit: 10 },
//     events: { url: "/api/events", limit: 20 },
// };

// OPTION 1
// 1. Define a more restrictive `Config` type.
type Config = {
    users: RequestInfo;
    events: RequestInfo;
};

// 2. Use the `satisfies` keyword.
export const config = {
    users: { url: "/api/users", limit: 10 },
    events: { url: "/api/events", limit: 20 },
} satisfies Config;

// OPTION 2
// 1. Define a more restrictive `Config` type.
type ConfigMoreRestrictive = {
    users: { url: "/api/users"; limit: number };
    events: { url: "/api/events"; limit: number };
};

// This is type string
const _userUrl = config.users.url;
// This is type string
const _eventUrl = config.events.url;

// 2. Use the `satisfies` keyword.
export const configMoreRestrictive = {
    users: { url: "/api/users", limit: 10 },
    events: { url: "/api/events", limit: 20 },
} satisfies ConfigMoreRestrictive;

// This is type "/api/users"
const _userUrlMoreRestrictive = configMoreRestrictive.users.url;
// This is type "/api/events"
const _eventUrlMoreRestrictive = configMoreRestrictive.events.url;

test("", () => {});
