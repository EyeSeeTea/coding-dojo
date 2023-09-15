import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Show DHIS2 instance info",
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

            const numberDataElements = await api.models.dataElements
                .get({
                    fields: {
                        $all: true,
                    },
                    filter: {
                        valueType: { eq: "NUMBER" },
                    },
                    paging: true,
                    pageSize: 100,
                })
                .getData();

            //Add all the dataElements to an array
            const dataElements = await getAllDataElements(api, numberDataElements);
            (dataElements as Array<any>)[0].forEach((el: any) => (el.shortName = "Exercise 3"));

            const resultAsync = await api.metadata.postAsync({ dataElements: [dataElements] }).getData();
            console.log(JSON.stringify(resultAsync));

            const summary = await api.system.waitFor(resultAsync.response.jobType, resultAsync.response.id).getData();
            console.debug(summary);
        },
    });

    run(cmd, process.argv.slice(2));
}

async function getAllDataElements(api: D2Api, numberDataElements: any) {
    const dataElements: any = [];

    dataElements.push(numberDataElements.dataElements);

    if ((numberDataElements.pager as any).nextPage) {
        const nextDataElements = await api
            .get<any>(((numberDataElements.pager as any).nextPage as string).substring(34))
            .getData();
        console.log("nextDataElements", nextDataElements.dataElements);

        await getAllDataElements(api, nextDataElements);
    }
    console.log("finalDataElements", dataElements[0].length);

    return dataElements;
}

main();
