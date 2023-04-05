import path from "path";
import { command, run, string, option } from "cmd-ts";
import { D2Api } from "../types/d2-api";
import _ from "lodash";

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description:
            "New script using api.models and api.medatada (bulk): get all orgUnits for group 'NGO', set the closedDate for today and post them.",
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
            const result = await api.models.organisationUnits
                .get({
                    fields: { closedDate: true, organisationUnitGroups: { name: true }, $owner: true },
                    paging: false,
                    filter: { "organisationUnitGroups.name": { eq: "NGO" } },
                })
                .getData()
                .then(res => {
                    console.log("Organisation units that match the criteria:");
                    res.objects.forEach(ou =>
                        console.debug(_.pick(ou, ["id", "name", "closedDate", "organisationUnitGroups"]))
                    );

                    return api.metadata
                        .post({
                            organisationUnits: res.objects.map(ou => ({
                                ...ou,
                                closedDate: new Date().toISOString(),
                            })),
                        })
                        .getData();
                })
                .catch(err => console.log(JSON.stringify(err)));
            console.debug(result && result.status);
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
