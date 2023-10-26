import { FutureData } from "../../data/api-futures";
import { Product } from "../entities/Product";
import { Future } from "../entities/generic/Future";

export class ValidateProductQuantityUseCase {
    execute(quantity: number): FutureData<number> {
        if (!Product.isValidNumber(quantity))
            return Future.error(new Error("Only numbers are allowed"));

        if (!Product.isPositiveNumber(quantity))
            return Future.error(new Error("Only positive numbers are allowed"));

        return Future.success(quantity);
    }
}
