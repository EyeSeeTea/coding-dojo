import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { DataElementD2Repository } from "../data/repositories/DataElementD2Repository";
import { UserD2Repository } from "../data/repositories/UserD2Repository";
import { GetDataElementsUseCase } from "../domain/usecases/GetDataElementsUseCase";

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Show DHIS2 instance info",
        args: {
            url: option({
                type: string,
                long: "url",
                description: "http[s]://[USERNAME:PASSWORD@]HOST:PORT",
            }),
            auth: option({
                type: string,
                long: "auth",
                description: "USERNAME:PASSWORD",
            }),
        },
        handler: async args => {
            const [username, password] = args.auth.split(":");
            const api = new D2Api({
                baseUrl: args.url,
                auth: {
                    username: username || "",
                    password: password || "",
                },
            });
            const dataElementRepo = new DataElementD2Repository(api);
            const userRepo = new UserD2Repository(api);
            const dataElement = await new GetDataElementsUseCase(dataElementRepo, userRepo)
                .execute()
                .toPromise();

            console.debug(dataElement);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
