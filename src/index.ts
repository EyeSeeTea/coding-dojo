import { run, subcommands } from "cmd-ts";
import genericCmd from "./generic";

function main() {
    const cliSubcommands = subcommands({
        name: "openai",
        description: "Command-line interface to interact with OpenAI's JavaScript/TypeScript API",
        version: "0.0.1",
        cmds: {
            generic: genericCmd,
        },
    });

    const args = process.argv.slice(2);
    run(cliSubcommands, args);
}

main();