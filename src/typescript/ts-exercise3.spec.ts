/*
EXERCISE: when and how to use "satisfies"

Check at the code below. Currently, `config` is an unrestricted object.

We want to enforce stricter typings for `config`. Refactor its definition using:

1. Define a more restrictive `Config` type.
2. Use the `satisfies` keyword.
3. ... if you can think of another way to do it, go for it!

When you're done, reflect on the differences between the different approaches.
*/

type RequestInfo = { url: string; limit: number };

type Config = object;

export const config: Config = {
    users: { url: "/api/users", limit: 10 },
    events: { url: "/api/events", limit: 20 },
};
