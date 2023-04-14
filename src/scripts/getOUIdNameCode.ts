import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { Maybe } from "../types/utils";

// - new script using api.models
// - get organisationUnits in the instance (fields: id, name, code)
// - print org units, format: "[ID] NAME (CODE)"
// - One line per org unit.

type OUs = Maybe<{
    id: string;
    name: string;
    code: string;
}>;

function printOUs(orgs: OUs[]) {
    orgs.forEach(org => console.debug(`[${org?.id}] ${org?.name} (${org?.code})`));
}

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

            const orgs: OUs[] = await api.models.organisationUnits
                .get({
                    fields: {
                        id: true,
                        name: true,
                        code: true,
                    },
                })
                .getData()
                .then(data => data.objects.map(i => i));

            printOUs(orgs);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
