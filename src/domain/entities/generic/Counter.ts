import { Struct } from "./Struct";

export type CounterValue = {
    value: number;
};

export class Counter extends Struct<CounterValue>() {
    decrement() {
        this.value = this.value - 1;
    }
    increment() {
        this.value = this.value + 1;
    }
}
