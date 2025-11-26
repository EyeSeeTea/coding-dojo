import { ChartRepository } from "../../domain/repositories/ChartRepository";
import { FutureData } from "../api-futures";
import {
    AreaChart,
    BarChart,
    Chart,
    LineChart,
    PieChart,
    ScatterChart,
} from "../../domain/entities/Chart";
import testData from "../data.json";
import { Future } from "../../domain/entities/generic/Future";

const line = testData.lineChart as LineChart;
const area = testData.areaChart as AreaChart;
const bar = testData.barChart as BarChart;
const stackedBar = testData.stackedBarChart as BarChart;
const pie = testData.pieChart as PieChart;
const donut = testData.donutChart as PieChart;
const scatter = testData.scatterChart as ScatterChart;

export class ChartTestRepository implements ChartRepository {
    list(): FutureData<Chart[]> {
        return Future.success([line, area, bar, stackedBar, pie, donut, scatter]);
    }
}
