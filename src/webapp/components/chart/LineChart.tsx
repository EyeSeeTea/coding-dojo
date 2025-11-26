import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";

import {
    LineChart as RechartsLineChart,
    Line as RechartsLine,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
    LegendProps,
} from "recharts";

import { LineChart } from "../../../domain/entities/Chart";
import { formatData } from "./utils";
import { Box } from "@material-ui/core";

//https://www.chartjs.org/docs/latest/samples/line/line.html
//https://www.chartjs.org/docs/latest/charts/line.html
export const LineChartJS: React.FC<LineChart> = props => {
    const { data, options } = props;

    // assuming all data has same x values
    const firstSeries = data.series[0];
    const xData = firstSeries ? firstSeries.data.map(point => point.x) : [];
    const labels = formatData(xData, options?.xAxis?.format);

    const chartData: ChartData<"line"> = {
        labels,
        datasets: data.series.map(series => ({
            label: series.name,
            data: series.data.map(point => point.y),
            fill: options?.fill ?? false,
            tension: options?.tension,
        })),
    };

    const chartOptions: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
            legend: {
                display: options?.legend?.show ?? true,
                position: options?.legend?.position ?? "top",
            },
            title: {
                display: !!options?.title,
                text: options?.title,
            },
            subtitle: {
                display: !!options?.subtitle,
                text: options?.subtitle,
            },
        },
        scales: {
            x: {
                title: options?.xAxis?.label
                    ? { display: true, text: options.xAxis.label }
                    : undefined,
                min: options?.xAxis?.min,
                max: options?.xAxis?.max,
            },
            y: {
                title: options?.yAxis?.label
                    ? { display: true, text: options.yAxis.label }
                    : undefined,
                min: options?.yAxis?.min,
                max: options?.yAxis?.max,
            },
        },
    };

    return <Line data={chartData} options={chartOptions} />;
};

//https://recharts.github.io/en-US/examples/SimpleLineChart/
export const LineChartRecharts: React.FC<LineChart> = props => {
    const { data, options } = props;

    if (!data.series.length) return null;

    //assuming all data has same x values
    const firstSeries = data.series[0];
    const xValues = firstSeries ? firstSeries.data.map(point => point.x) : [];
    const xLabels = formatData(xValues, options?.xAxis?.format);

    // [{ x: label0, seriesId1: y0, seriesId2: y0, ... }, ...]
    const combinedData = xValues.map((_, index) => {
        const point: Record<string, unknown> = {
            x: xLabels[index],
        };

        data.series.forEach(series => {
            const y = series.data[index]?.y;
            point[series.id] = y;
        });

        return point;
    });

    const width = options?.width ?? 600;
    const height = options?.height ?? 300;

    const getLegendProps = (): LegendProps => {
        const pos = options?.legend?.position;
        switch (pos) {
            case "right":
                return {
                    layout: "vertical",
                    verticalAlign: "middle",
                    align: "right",
                };
            case "left":
                return {
                    layout: "vertical",
                    verticalAlign: "middle",
                    align: "left",
                };
            case "bottom":
                return {
                    layout: "horizontal",
                    verticalAlign: "bottom",
                    align: "center",
                };
            case "top":
            default:
                return {
                    layout: "horizontal",
                    verticalAlign: "top",
                    align: "center",
                };
        }
    };

    return (
        <Box width={"100%"}>
            {options?.title && <div>{options.title}</div>}
            {options?.subtitle && <div>{options.subtitle}</div>}
            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart data={combinedData} width={width} height={height}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="x" />
                    <YAxis />

                    {options?.tooltip?.enabled !== false && <Tooltip />}

                    {options?.legend?.show !== false && <Legend {...getLegendProps()} />}

                    {data.series.map((series, idx) => (
                        <RechartsLine
                            key={series.id}
                            dataKey={series.id}
                            name={series.name}
                            stroke={options?.colors?.[idx]}
                            strokeWidth={2}
                            isAnimationActive={false}
                        />
                    ))}
                </RechartsLineChart>
            </ResponsiveContainer>
        </Box>
    );
};
