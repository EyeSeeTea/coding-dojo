import path from "path";
import { command, run, string, option } from "cmd-ts";
import { D2Api } from "../types/d2-api";

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description:
            "New script using api.models: get organisationUnits in the instance (fields: id, name, code) and print them on format `[ID] NAME (CODE)`. One line per orgUnit.",
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
            const result = await api.models.organisationUnits
                .get({ fields: { id: true, name: true, code: true }, paging: false })
                .getData();
            result.objects.forEach(({ id, name, code }) =>
                console.log(`[${id}] ${name} ${code ? "(" + code + ")" : ""}`)
            );
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
