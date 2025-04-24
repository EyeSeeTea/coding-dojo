/*
EXERCISE: when and how to use "satisfies"

Check at the code below. Currently, `config` is an unrestricted object.

We want to enforce stricter typings for `config`. Refactor its definition using:

1. Define a more restrictive `Config` type.
2. Use the `satisfies` keyword.
3. ... if you can think of another way to do it, go for it!

When you're done, reflect on the differences between the different approaches.
*/
import { test } from "vitest";

type RequestInfo = { url: string; limit: number };

type Config = object;

export const config: Config = {
    users: { url: "/api/users", limit: 10 },
    events: { url: "/api/events", limit: 20 },
};

// 1. Define restrictive `Config` type (without satisfies)
type Config2Keys = "users" | "events";
type Config2 = Record<Config2Keys, RequestInfo>;
export const config2: Config2 = {
    users: { url: "/api/users", limit: 10 },
    events: { url: "/api/events", limit: 20 },
};
console.log(config2.events.url);

// 2. Use the `satisfies` keyword
type Config3 = Record<string, RequestInfo>;
export const config3 = {
    users: { url: "/api/users", limit: 10 },
    events: { url: "/api/events", limit: 20 },
} satisfies Config3;
// events property is inferred because of satisfies usage
console.log(config3.events.url);

//----
// 3. without satisfies
type Config4 = Record<string, RequestInfo>;
export const config4: Config4 = {
    users: { url: "/api/users", limit: 10 },
    events: { url: "/api/events", limit: 20 },
};

// @ts-expect-error since it is indexed by string, events is not inferred
console.log(config4.events.url);

test("dummy test to avoid failure in the suite");
