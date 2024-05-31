// Kata 1: Implement a class Counter that uses Struct, so we can do this:
// count counter = Counter.create({value: 1});
// counter.increment().value; // 2
// counter.decrement().value; // 0

import { Struct } from "./Struct";

export class Counter extends Struct<{ value: number }>() {
    increment(): Counter {
        return this._update({ value: this.value + 1 });
    }
    decrement(): Counter {
        return this._update({ value: this.value - 1 });
    }
}
