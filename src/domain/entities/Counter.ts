import { Struct } from "./generic/Struct";

type CounterAttributes = {
    value: number;
};

export class Counter extends Struct<CounterAttributes>() {
    increment() {
        return Counter.create({ value: ++this.value });
    }
    decrement() {
        return Counter.create({ value: --this.value });
    }
}
