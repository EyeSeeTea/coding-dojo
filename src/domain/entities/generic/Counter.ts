import { Struct } from "./Struct";

export type CounterValue = {
    value: number;
};

export class Counter extends Struct<CounterValue>() {
    decrement() {
        this._update({ value: (this.value -= 1) });
    }
    increment() {
        this._update({ value: (this.value += 1) });
    }
}
