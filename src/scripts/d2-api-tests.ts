import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";

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
            // get orgUnits in the instance in the format: "[ID] NAME (CODE)"
            const res = await api.models.organisationUnits
                .get({
                    fields: {
                        id: true,
                        name: true,
                        code: true,
                    },
                    pageSize: 50,
                    paging: true,
                })
                .getData();

            const orgUnitString = res.objects.map(
                organisationUnit => `[${organisationUnit.id}] ${organisationUnit.name} (${organisationUnit.code})`
            );
            console.debug(orgUnitString);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
