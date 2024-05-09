import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { DataElementD2Repository } from "../data/repositories/DataElementD2Repository";
import { GetAllDataElementsUseCase } from "../domain/usecases/GetAllDataElementsUseCase";
import { UserD2Repository } from "../data/repositories/UserD2Repository";

// Usage:
// npx ts-node src/scripts/export-products.ts -u "https://dev.eyeseetea.com/play" -a admin:district -n "fileName"

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Get data elements",
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

            const dataElementRepository = new DataElementD2Repository(api);
            const userRepository = new UserD2Repository(api);

            new GetAllDataElementsUseCase(dataElementRepository, userRepository).execute().run(
                dataElements => console.debug("Data Elements fetched:\n", dataElements),
                err => console.error("Error fetching Data Elements: ", err)
            );
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
