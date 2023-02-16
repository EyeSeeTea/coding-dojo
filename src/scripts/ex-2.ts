import { command, run, string, option } from "cmd-ts";
import path from "path";

import { D2Api, Ref } from "../types/d2-api";

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Show DHIS2 instance info",
        args: {
            url: option({
                type: string,
                long: "dhis2-url",
                short: "u",
                description: "DHIS2 base URL. Example: http://USERNAME:PASSWORD@localhost:8080",
            }),
        },
        handler: async args => {
            // Exercise: Example: get the first 10 dataSets + add an indicator (ANC 1 Coverage) to the existing + post dataSets: check status.
            const api = new D2Api({ baseUrl: args.url });
            const first10Datasets = await api.models.dataSets
                .get({
                    pageSize: 10,
                    fields: {
                        id: true,
                        name: true,
                        displayName: true,
                        indicators: true,
                        periodType: true,
                    },
                })
                .getData();

            //id for indicator "ANC 1 Coverage" is "Uvn6LCg7dVU"
            const ANC1CoverageId: Ref = { id: "Uvn6LCg7dVU" };

            const updatedDatasets = first10Datasets.objects.map(datasets => {
                datasets.indicators = [...datasets.indicators, ANC1CoverageId];
                return datasets;
            });

            const result = await api.metadata.post({ dataSets: updatedDatasets }).getData();
            console.info(`Dataset Update status : ${result.status}, stats: ${JSON.stringify(result.stats)} `);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
