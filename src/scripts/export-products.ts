import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { getWebappCompositionRoot } from "../CompositionRoot";
import { TablePagination, TableSorting } from "../domain/entities/TablePagination";
import { Product } from "../domain/entities/Product";

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
        },
        handler: async args => {
            const [username = "", password = ""] = args.auth.split(":");
            const api = new D2Api({
                backend: "xhr",
                baseUrl: args.url,
                auth: { username: username, password: password },
            });

            const page: TablePagination = {
                pageSize: 10,
                total: 1,
                page: 1,
            };

            const order: TableSorting<Product> = {
                field: "title",
                order: "asc",
            };
            const compositionRoot = getWebappCompositionRoot(api).products;
            const value = await compositionRoot.getAll.execute(page, order).toPromise();

            await compositionRoot.exportToExcel.execute(value.objects);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
