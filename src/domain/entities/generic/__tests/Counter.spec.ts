import { Counter } from "../Counter";

describe("Counter", () => {
    test("should be created with the provided value", () => {
        const counter = Counter.create({ value: 1 });
        expect(counter.value).toEqual(1);
    });
    test("should increment 1 value when increment function is called", () => {
        const counter = Counter.create({ value: 1 });
        counter.increment();
        expect(counter.value).toEqual(2);
    });
    test("should decrement 1 value when decrement function is called", () => {
        const counter = Counter.create({ value: 1 });
        counter.decrement();
        expect(counter.value).toEqual(0);
    });
});
