import { command, run, string, option } from "cmd-ts";
import path from "path";
import { D2Api } from "../types/d2-api";

// - new script using api.models and api.metadata (bulk)
// - get all orgUnits for group "NGO", set the closedDate for today and post them.

type OUs = {
    id: string;
    name: string;
};

function printOUs(orgs: OUs[]) {
    orgs.forEach(org => console.debug(`[${org?.id}] ${org?.name}`));
}

function main() {
    const cmd = command({
        name: path.basename(__filename),
        description: "Get all organisationUnits from 'NGO' group and set theirs closedDate for today.",
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

            const ngoGroupId = await api.models.organisationUnitGroups
                .get({
                    fields: {
                        id: true,
                    },
                    filter: {
                        code: { eq: "NGO" },
                    },
                })
                .getData()
                .then(data => data.objects.reduce(i => i).id);

            console.debug(`ngoGroupId: ${ngoGroupId}`);

            const orgs = await api.models.organisationUnits
                .get({
                    fields: {
                        $owner: true,
                    },
                    filter: {
                        "organisationUnitGroups.id": { eq: ngoGroupId },
                    },
                })
                .getData()
                .then(data => data.objects.map(obj => ({ ...obj, closedDate: new Date().toISOString() })));

            console.debug(`OUS to be closed:`);
            printOUs(orgs);

            api.metadata
                .post({ organisationUnits: orgs })
                .getData()
                .then(data => {
                    if (data.status !== "OK") throw new Error(`POST failed: ${JSON.stringify(data)}`);
                });
        },
    });

    run(cmd, process.argv.slice(2));
}

main();
