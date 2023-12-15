import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { ProductD2Repository } from "../data/repositories/ProductD2Repository";
import { ProductExportSpreadsheetRepository } from "../data/repositories/ProductExportSpreadsheetRepository";
import { ExportProductsUseCase } from "../domain/usecases/ExportProductsUseCase";

// Usage:
// npx ts-node src/scripts/export-products.ts -u "https://dev.eyeseetea.com/play" -a admin:district -p "./products.xlsx"
/*

Apply the concepts seen in this session to: src/data/repositories/ProductExportSpreadsheetRepository.ts
Create a script src/scripts/export-products.ts (see example.ts) that gets all the products from dev.eyeseetea 
and exports them to an Excel file using the repository of step 1 
(Following clean arch, create also a use case to be called from the script)
 */

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
            path: option({
                type: string,
                long: "path",
                short: "p",
                description: "path to save spreadsheet file",
            }),
        },
        handler: async args => {
            const [username = "", password = ""] = args.auth.split(":");
            const api = new D2Api({
                backend: "xhr",
                baseUrl: args.url,
                auth: { username: username, password: password },
            });
            const productRepository = new ProductD2Repository(api);
            const exportProductRepository = new ProductExportSpreadsheetRepository();
            new ExportProductsUseCase(exportProductRepository, productRepository)
                .execute(args.path)
                .run(() => console.debug(`Products exported to ${args.path}`), console.error);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
