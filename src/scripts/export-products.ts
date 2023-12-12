import { command, run, string, option, number, optional } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { getWebappCompositionRoot } from "../CompositionRoot";

// Usage:
// npx ts-node src/scripts/example.ts -u "https://dev.eyeseetea.com/play" -a admin:district

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Show DHIS2 instance info",
        args: {
            url: option({
                type: string,
                long: "url",
                short: "u",
                description: "DHIS2 base URL. Example: http://localhost:8080",
            }),
            auth: option({
                type: string,
                long: "auth",
                short: "a",
                description: "DHIS2 auth: USERNAME:PASSWORD",
            }),
            filename: option({
                type: string,
                long: "filename",
                short: "f",
                description: "Name of the Excel file",
            }),
            page: option({
                type: optional(number),
                long: "page",
                short: "p",
                description: "Page number",
            }),
            pageSize: option({
                type: optional(number),
                long: "page-size",
                short: "s",
                description: "Count of products per page",
            }),
        },
        handler: async args => {
            const [username = "", password = ""] = args.auth.split(":");
            const api = new D2Api({
                backend: "xhr",
                baseUrl: args.url,
                auth: { username: username, password: password },
            });
            const compositionRoot = getWebappCompositionRoot(api);
            const products = await compositionRoot.products.getAll
                .execute(
                    { page: args.page ?? 1, pageSize: args.pageSize ?? 50, total: 0 },
                    { field: "title", order: "asc" }
                )
                .map(res => res.objects)
                .toPromise();
            await compositionRoot.products.export.execute(args.filename, products);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
