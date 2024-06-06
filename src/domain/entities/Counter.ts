import { Struct } from "./generic/Struct";
import _ from "./generic/Collection";
import { Future } from "./generic/Future";

//Kata 1
interface CounterAttrs {
    value: number;
}

export class Counter extends Struct<CounterAttrs>() {
    //Create a new instance of the Counter class with value incremented by 1
    increment = () => {
        return Counter.create({ ...this, value: this.value + 1 });
    };

    //Create a new instance of the Counter class with value decremented by 1
    decrement = () => {
        return Counter.create({ ...this, value: this.value - 1 });
    };
}

const counter = Counter.create({ value: 1 });

console.debug(counter.value);
console.debug(counter.increment().value);
console.debug(counter.decrement().value);

//Kata 2
const indexOfb = _(["a", "b", "c"]).indexOf("c");
console.debug(indexOfb);

const indexOf2 = _([1, 2, 3]).indexOf(1);
console.debug(indexOf2);

//Kata 3
const n1$ = Future.success(1);
const n2$ = n1$.isomap(n => n + 1);
n2$.run(
    n2 => console.debug("n2$:", n2),
    err => console.debug(err)
);
