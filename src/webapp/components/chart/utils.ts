import { AxisOptions } from "../../../domain/entities/ChartOptions";

export function formatData(data: number[], format: AxisOptions["format"] = "number") {
    return data.map(d => {
        switch (format) {
            case "number":
                return d;
            case "percentage":
                return `${d}%`;
            case "date":
                return new Date(d).toLocaleDateString();
        }
    });
}
