import { useEffect, useState } from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";

import { useAppContext } from "../../contexts/app-context";
import { Chart } from "../../../domain/entities/Chart";
import { LineChartJS, LineChartRecharts } from "../../components/chart/LineChart";

export const ChartsPage = () => {
    const { compositionRoot } = useAppContext();

    const [charts, setCharts] = useState<Chart[]>([]);

    useEffect(() => {
        compositionRoot.charts.list.execute().run(chartsData => {
            setCharts(chartsData);
        }, console.error);
    });

    return (
        <Box>
            <Row>
                <h1>ChartJS</h1>
                <h1>Rechart</h1>
            </Row>
            {charts.map(chart => (
                <ChartRow key={chart.id} chart={chart} />
            ))}
        </Box>
    );
};

const ChartRow = (prop: { chart: Chart }) => {
    const { chart } = prop;

    const getChartJS = () => {
        switch (chart.type) {
            case "line":
                return <LineChartJS {...chart} />;
            case "area":
            case "scatter":
            case "bar":
            case "pie":
                return <></>;
        }
    };
    const getRechart = () => {
        switch (chart.type) {
            case "line":
                return <LineChartRecharts {...chart} />;
            case "area":
            case "scatter":
            case "bar":
            case "pie":
                return <></>;
        }
    };

    return (
        <Row>
            <Box>{getChartJS()}</Box>
            <Box>{getRechart()}</Box>
        </Row>
    );
};

const Row = ({ children }: { children: React.ReactNode }) => <TwoColumns>{children}</TwoColumns>;

const TwoColumns = styled(Box)`
    display: flex;
    gap: 16px;
    text-align: center;

    & > * {
        flex: 1;
    }
`;
