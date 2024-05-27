import { describe, expect, it } from "vitest";
import { Counter } from "../Counter";

describe("Counter", () => {
    const counter = Counter.create({ value: 1 });

    it("should create with specified value", () => {
        expect(counter.value).toEqual(1);
    });

    it("should increment", () => {
        expect(counter.increment().value).toEqual(2);
    });

    it("should decrement", () => {
        expect(counter.decrement().value).toEqual(1);
    });
});
