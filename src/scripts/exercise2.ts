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
            const orgUnitGroups = await api.models.organisationUnitGroups
                .get({
                    fields: {
                        id: true,
                    },
                    filter: {
                        code: { eq: "NGO" },
                    },
                })
                .getData();

            const orgUnits = await api.models.organisationUnits
                .get({
                    fields: {
                        $all: true,
                    },
                })
                .getData();

            //hardcoded random orgUnitGroup id because the one for NGO didn't exist
            const filteredOrgUnits = orgUnits.objects.filter(({ organisationUnitGroups }) =>
                organisationUnitGroups.map(el => el.id).includes("f25dqv3Y7Z0")
            );

            filteredOrgUnits.forEach(orgUnit => {
                orgUnit.closedDate = new Date().toISOString();
            });

            const metadata = await api.metadata
                .post({
                    organisationUnits: {
                        ...filteredOrgUnits,
                    },
                })
                .getData();

            console.debug(metadata);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
