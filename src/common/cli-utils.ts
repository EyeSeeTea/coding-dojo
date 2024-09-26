import { option, optional, string } from "cmd-ts";

export function getCommonOptions() {
    return {
        apiKey: option({
            type: string,
            long: "apiKey",
            short: "k",
            description: "OpenAI API Key. Create yours at: https://platform.openai.com/api-keys",
        }),
        organizationId: option({
            type: optional(string),
            long: "orgId",
            description: "Organisation ID for use cases where the API key is restricted to a specific organisation.",
        })
    };
}

function getDescriptionLines(s: string | string[]): string[] {
    return Array.isArray(s) ? s : [s]
}

function mapTopic({ title, description }: Topic): string[] {
    return [
        `${title}:`,
        ...getDescriptionLines(description).map(s => `  - ${s}`),
        "" //breakline
    ];
}

export function longDescription(description: string[] | string, topics: Topic[] = []): string {
    return getDescriptionLines(description)
        .concat(topics.map(mapTopic).flat())
        .join('\n\t');
}

type Topic = {
    title: string,
    description: string[] | string
}