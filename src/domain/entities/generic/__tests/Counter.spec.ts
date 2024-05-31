import { Counter } from "../Counter";

const counter = new Counter({ value: 1 });

test("increment value", () => {
    expect(counter.increment().value).toEqual(2);
});

test("decrement value", () => {
    expect(counter.decrement().value).toEqual(0);
});
