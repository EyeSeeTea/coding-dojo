import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { filter } from "lodash";

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

            const orgUnits = await api.models.organisationUnits
                .get({
                    fields: {
                        $all: true,
                    },
                    filter: {
                        "organisationUnitGroups.name": { eq: "NGO" },
                    },
                    paging: false,
                })
                .getData()
                .then(res => res.objects);

            orgUnits.forEach(orgUnit => {
                orgUnit.closedDate = new Date().toISOString();
            });

            const metadata = await api.metadata
                .post({
                    organisationUnits: {
                        ...orgUnits,
                    },
                })
                .getData();

            console.debug(orgUnits.map(el => el.organisationUnitGroups));
            console.debug(metadata);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
