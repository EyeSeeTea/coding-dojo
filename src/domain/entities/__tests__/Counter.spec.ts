import { Counter } from "../Counter";

const initialValue = 1;

describe("Counter", () => {
    it("should increment/decrement value", () => {
        const counter = Counter.create({ value: initialValue });
        expect(counter.increment().value).toBe(2);
        expect(counter.decrement().value).toBe(0);
    });
});
