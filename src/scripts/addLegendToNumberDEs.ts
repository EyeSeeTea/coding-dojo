import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api, MetadataPick, Ref } from "../types/d2-api";

type deMetadata = MetadataPick<{
    dataElements: { fields: { $owner: true } };
}>;

async function getPagedNumberDEs(api: D2Api, page: number, legendID: string): Promise<deMetadata> {
    const aggregateData: deMetadata = { dataElements: [] };
    const { pager, objects } = await api.models.dataElements
        .get({
            fields: { $owner: true },
            filter: { valueType: { eq: "NUMBER" } },
            page: page,
            pageSize: 100,
        })
        .getData()
        .then(data => {
            const objects = data.objects.map(de => {
                const legendSet = { id: legendID } as Ref;

                const rep = de.legendSets.find(ls => ls.id === legendID);
                if (!rep) {
                    de.legendSets.push(legendSet);
                }

                return de;
            });

            return { pager: data.pager, objects: objects };
        });

    if (pager.pageCount > 1 && pager.page !== pager.pageCount) {
        const result = await getPagedNumberDEs(api, page + 1, legendID);
        aggregateData.dataElements = objects.concat(result.dataElements);
    } else {
        aggregateData.dataElements = objects;
    }

    return aggregateData;
}

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Add the legend 'ANC Coverage' to all dataElements with type number.",
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

            const legendID = await api.models.legendSets
                .get({
                    fields: { id: true },
                    filter: { name: { eq: "ANC Coverage" } },
                })
                .getData()
                .then(data => data.objects.reduce(i => i).id);

            const numberDataElements = await getPagedNumberDEs(api, 1, legendID);

            console.debug("numberDataElements len:\n", numberDataElements.dataElements.length);
            // console.debug("numberDataElements:\n", JSON.stringify(numberDataElements));

            const resultAsync = await api.metadata.postAsync(numberDataElements).getData();
            // console.debug("resultAsync:\n", JSON.stringify(resultAsync));

            const summary = await api.system.waitFor(resultAsync.response.jobType, resultAsync.response.id).getData();
            console.debug(`Async Post Status: ${summary?.status}`);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
