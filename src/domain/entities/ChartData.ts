type BaseDataPoint = {
    id?: string;
    metadata?: Record<string, unknown>;
};

type DataSeries<T extends BaseDataPoint> = {
    id: string;
    name: string;
    data: T[];
};

// point data
type XYPoint = BaseDataPoint & {
    x: number;
    y: number;
};
export type PointChartData = {
    series: DataSeries<XYPoint>[];
};

// categorical data
type CategoricalPoint = BaseDataPoint & {
    category: string;
    value: number;
};
export type BarChartData = {
    series: DataSeries<CategoricalPoint>[];
};
export type PieChartData = {
    slices: CategoricalPoint[];
};
