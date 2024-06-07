import { Struct } from "./generic/Struct";

export type CounterAttrs = { value: number };

export class Counter extends Struct<CounterAttrs>() {
    increment() {
        return Counter.create({ ...this, value: this.value + 1 });
    }

    decrement() {
        return Counter.create({ ...this, value: this.value - 1 });
    }
}
