import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Get all DHIS2 organisationUnits (1332)",
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
            const pageSize = 50;
            let parsedOrgUnits: string[] = [];
            let orgUnits: { objects: Array<{ id: string; name: string; code: string }> };
            let pageCount = 1;

            orgUnits = await api.models.organisationUnits
                .get({
                    pageSize,
                    page: pageCount,
                    fields: {
                        id: true,
                        name: true,
                        code: true,
                    },
                })
                .getData();

            while (orgUnits?.objects?.length > 0) {
                parsedOrgUnits = parsedOrgUnits.concat(
                    orgUnits.objects.map(orgUnit => `[${orgUnit.id}] ${orgUnit.name} (${orgUnit.code})`)
                );

                pageCount++;
                orgUnits = await api.models.organisationUnits
                    .get({
                        pageSize,
                        page: pageCount,
                        fields: {
                            id: true,
                            name: true,
                            code: true,
                        },
                    })
                    .getData();
            }

            console.debug(parsedOrgUnits);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
