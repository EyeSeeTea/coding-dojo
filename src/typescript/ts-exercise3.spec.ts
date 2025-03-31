type RequestInfo = { url: string; limit: number };

type Config = object;

export const config: Config = {
    users: { url: "/api/users", method: 10 },
    events: { url: "/api/events", method: 20 },
};

/*
EXERCISE

Currently, `config` is an unrestricted object.

We want to enforce stricter typings for `config`. Refactor its definition using, at least, two approaches:

1. Define a more restrictive `Config` type.
2. Use the `satisfies` keyword.

When you're done, reflect on the differences between the two approaches.
*/
