import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { Ref } from "../domain/entities/Ref";

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
            const api = new D2Api({ baseUrl: args.url });

            // get the first 10 datasets
            const { objects: dataSets } = await api.models.dataSets
                .get({
                    fields: {
                        id: true,
                        name: true,
                        displayName: true,
                        indicators: true,
                        periodType: true,
                    },
                    pageSize: 10,
                })
                .getData();

            // add ANC 1 Coverage indicator to each dataset
            const { indicators } = await api.metadata
                .get({
                    indicators: {
                        fields: {
                            id: true,
                        },
                        filter: {
                            name: {
                                eq: "ANC 1 Coverage",
                            },
                        },
                    },
                })
                .getData();

            const ANC1CoverageIndicator = indicators[0] as Ref;
            const dataSetsWithANCIndicators = dataSets.map(dataSet => {
                dataSet.indicators = [...dataSet.indicators, ANC1CoverageIndicator];
                return dataSet;
            });

            // post the new dataset value and log the response
            const response = await api.metadata.post({ dataSets: dataSetsWithANCIndicators }).getData();
            console.debug(response);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
