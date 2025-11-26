import { FutureData } from "../../data/api-futures";
import { ChartRepository } from "../repositories/ChartRepository";
import { Chart } from "../entities/Chart";

export class ListChartsUseCase {
    constructor(private chartRepository: ChartRepository) {}

    public execute(): FutureData<Chart[]> {
        return this.chartRepository.list();
    }
}
