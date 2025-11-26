export type AxisOptions = {
    label?: string;
    min?: number;
    max?: number;
    format?: "number" | "date" | "percentage";
};

type LegendOptions = {
    show: boolean;
    position?: "top" | "bottom" | "right" | "left";
};

type TooltipOptions = {
    enabled: boolean;
    format?: string;
    shared?: boolean;
};

type BaseChartOptions = {
    title?: string;
    subtitle?: string;
    width?: number;
    height?: number;
    legend?: LegendOptions;
    tooltip?: TooltipOptions;
    colors?: string[];
};

export type LineChartOptions = BaseChartOptions & {
    xAxis?: AxisOptions;
    yAxis?: AxisOptions;
    tension?: number;
    fill?: boolean;
};

export type AreaChartOptions = BaseChartOptions & {
    xAxis?: AxisOptions;
    yAxis?: AxisOptions;
    stacked?: boolean;
    opacity?: number;
};

export type ScatterChartOptions = BaseChartOptions & {
    xAxis?: AxisOptions;
    yAxis?: AxisOptions;
    pointSize?: number;
    showTrendline?: boolean;
};

export type BarChartOptions = BaseChartOptions & {
    xAxis?: AxisOptions;
    yAxis?: AxisOptions;
    orientation?: "vertical" | "horizontal";
    stacked?: boolean;
    grouped?: boolean;
    barWidth?: number;
    borderRadius?: number;
};

export type PieChartOptions = BaseChartOptions & {
    donut?: boolean;
    innerRadius?: number;
    startAngle?: number;
    showLabels?: boolean;
    showValues?: boolean;
};
