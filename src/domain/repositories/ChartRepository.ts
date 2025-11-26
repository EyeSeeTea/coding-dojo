import { FutureData } from "../../data/api-futures";
import { Chart } from "../entities/Chart";

export interface ChartRepository {
    list(): FutureData<Chart[]>;
}
