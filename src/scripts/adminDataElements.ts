import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { DataElementD2Repository } from "../data/repositories/DataElementD2Repository";
import { GetDataElements } from "../domain/usecases/GetDataElements";
import { UserD2Repository } from "../data/repositories/UserD2Repository";

// yarn admin-data-elements -u "https://admin:district@dev.eyeseetea.com/play"
// yarn admin-data-elements -u "https://nonadmin:Non_admin1@dev.eyeseetea.com/play"

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Show DHIS2 data elements",
        args: {
            url: option({
                type: string,
                long: "dhis2-url",
                short: "u",
                description: "DHIS2 base URL. Example: http://USERNAME:PASSWORD@localhost:8080",
            }),
        },
        handler: async args => {
            const getDataElements = getUseCase(args.url);

            getDataElements.execute().run(
                dataElements => console.debug(dataElements),
                error => console.error(error.message)
            );
        },
    });

    run(cmd, process.argv.slice(2));
}

main();

function getUseCase(url: string) {
    const api = new D2Api({ baseUrl: url });
    const dataElementRepository = new DataElementD2Repository(api);
    const userRepository = new UserD2Repository(api);

    return new GetDataElements(dataElementRepository, userRepository);
}
