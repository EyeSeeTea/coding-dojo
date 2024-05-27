import { Struct } from "./generic/Struct";

export interface CounterAttrs {
    value: number;
}

export class Counter extends Struct<CounterAttrs>() {
    increment(): CounterAttrs {
        this.value++;
        return { value: this.value };
    }

    decrement(): CounterAttrs {
        this.value--;
        return { value: this.value };
    }
}
