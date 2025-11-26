import { BarChartData, PieChartData, PointChartData } from "./ChartData";
import {
    AreaChartOptions,
    BarChartOptions,
    LineChartOptions,
    PieChartOptions,
    ScatterChartOptions,
} from "./ChartOptions";

type BaseChartSpec = {
    id?: string;
};

export type LineChart = BaseChartSpec & {
    type: "line";
    data: PointChartData;
    options?: LineChartOptions;
};

export type AreaChart = BaseChartSpec & {
    type: "area";
    data: PointChartData;
    options?: AreaChartOptions;
};

export type ScatterChart = BaseChartSpec & {
    type: "scatter";
    data: PointChartData;
    options?: ScatterChartOptions;
};

export type BarChart = BaseChartSpec & {
    type: "bar";
    data: BarChartData;
    options?: BarChartOptions;
};

export type PieChart = BaseChartSpec & {
    type: "pie";
    data: PieChartData;
    options?: PieChartOptions;
};

export type Chart = LineChart | AreaChart | ScatterChart | BarChart | PieChart;
