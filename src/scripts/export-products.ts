import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { ProductExportSpreadsheetRepository } from "../data/repositories/ProductExportSpreadsheetRepository";
import { ProductD2Repository } from "../data/repositories/ProductD2Repository";
import { ExportProductsToSpreadsheetUseCase } from "../domain/usecases/ExportProductsToSpreadsheetUseCase";

// Usage:
// npx ts-node src/scripts/export-products.ts -u "https://dev.eyeseetea.com/play" -a admin:district -n "fileName"

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Get products from DHIS2 instance and export to Excel file",
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
            fileName: option({
                type: string,
                long: "fileName",
                short: "n",
                description: "Spreadsheet file name",
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
            const productExportSpreadsheetRepository = new ProductExportSpreadsheetRepository();
            new ExportProductsToSpreadsheetUseCase(
                productExportSpreadsheetRepository,
                productRepository
            ).execute(args.fileName);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
