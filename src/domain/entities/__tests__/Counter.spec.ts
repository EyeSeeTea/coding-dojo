import { Counter } from "../Counter";

describe("Counter", () => {
    it("should increment the value", () => {
        const counter = Counter.create({ value: 1 });
        const counterIncremented = counter.increment().value;
        expect(counterIncremented).toBe(2);
    });
    it("should decrement the value", () => {
        const counter = Counter.create({ value: 8 });
        const counterIncremented = counter.decrement().value;
        expect(counterIncremented).toBe(7);
    });
});
