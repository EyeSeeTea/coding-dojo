import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";
import { UserD2Repository } from "../data/repositories/UserD2Repository";
import { DataElementsD2Repository } from "../data/repositories/DataElementsD2Repository";
import {
    GetAllDataElementsUseCase,
    NonAdminError,
} from "../domain/usecases/GetAllDataElementsUseCase";
import { exit } from "process";

export async function getDataElements(api: D2Api) {
    const usersRepository = new UserD2Repository(api);
    const DataElementsRepository = new DataElementsD2Repository(api);

    const getAllDataElementsUseCase = new GetAllDataElementsUseCase(
        usersRepository,
        DataElementsRepository
    );

    try {
        const DataElements = await getAllDataElementsUseCase.execute().toPromise();
        console.debug(DataElements);
    } catch (error) {
        if (error instanceof NonAdminError) {
            console.error("Non-admin user cannot access data elements.");
        } else {
            console.error(error);
        }
        exit(1);
    }
}

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Show all dataelements in DHIS2 instance",
        args: {
            url: option({
                type: string,
                long: "dhis2-url",
                short: "u",
                description: "DHIS2 base URL. Example: http://USERNAME:PASSWORD@localhost:8080",
            }),
        },
        handler: async args => {
            const api = new D2Api({
                baseUrl: args.url,
            });

            getDataElements(api);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
