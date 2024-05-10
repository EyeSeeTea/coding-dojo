import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { DataElementD2Repository } from "../data/repositories/DataElementD2Repository";
import { GetDataElementsUseCase } from "../domain/usecases/GetDataElementsUseCase";
import { UserD2Repository } from "../data/repositories/UserD2Repository";
import { writeFileSync } from "fs";

// Usage:
// npx ts-node src/scripts/get-dataelements.ts -u "https://dev.eyeseetea.com/play" -a admin:district

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
            const dataElementRepository = new DataElementD2Repository(api);
            const userRepository = new UserD2Repository(api);

            new GetDataElementsUseCase(userRepository, dataElementRepository)
                .execute()
                .run(dataElements => {
                    console.debug(`${dataElements.length} dataElements found`);
                    writeFileSync("dataElements.json", JSON.stringify(dataElements, null, 4));
                }, console.error);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
