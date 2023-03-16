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
                        $owner: true,
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
            if (!ANC1CoverageIndicator) throw new Error("Indicator not found");
            const dataSetsWithANCIndicators = dataSets.map(dataSet => {
                return { ...dataSet, indicators: [...dataSet.indicators, ANC1CoverageIndicator] };
            });

            console.debug({ dataSets: dataSetsWithANCIndicators });
            // post the new dataset value and log the response
            const response = await api.metadata.post({ dataSets: dataSetsWithANCIndicators }).getData();
            console.debug(response);

            // exercise with curl
            // get the first 10 datasets
            // curl "https://admin:district@dev.eyeseetea.com/play/api/dataSets.json?fields=id,name,periodType&pageSize=10" | jq > datasets.json

            // get ANC 1 Coverage indicator, add to each dataset in datasets.json file and remove pager object
            // curl "https://admin:district@dev.eyeseetea.com/play/api/indicators.json?fields=id&filter=name:eq:ANC%201%20Coverage" | jq > ancIndicator.json

            // post the new dataset value
            // curl -H 'Content-Type: application/json' \
            //   -d @datasets.json  \
            //   -X POST \
            //   https://admin:district@dev.eyeseetea.com/play/api/dataSets | jq > response.json
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
