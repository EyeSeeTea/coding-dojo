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
            //Get all orgUnits and show [ID] NAME (CODE)
            const info = await api.models.organisationUnits
                .get({
                    pageSize: 50,
                    fields: {
                        id: true,
                        name: true,
                        code: true,
                    },
                })
                .getData();
            const formattedOrgUnits = info.objects.map(
                orgUnits => `[${orgUnits.id}] ${orgUnits.name} (${orgUnits.code})`
            );
            console.debug(formattedOrgUnits);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
