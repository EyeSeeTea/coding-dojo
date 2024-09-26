import OpenAI from "openai";
import { command, flag, number, option, optional, positional, string } from "cmd-ts";
import { getCommonOptions, longDescription } from "./common/cli-utils";
import { create } from "./common/completions";
import { Message } from "./entities/Message";

const tone: Message = { role: "system", content: "You are a helpful AI assistant." }

async function handler(args) {
    const openai = new OpenAI({ apiKey: args.apiKey, organization: args.organisationID });
    const options = { model: args.model, maxTokens: args.maxTokens, temperature: args.temperature };
    const messages: Message[] = [tone, { role: "user", content: args.prompt }];
    const res = await create(openai, messages, options);

    console.log(args.stats ? res : res.message);
}

const topics = [
    {
        title: "TERMS AND POLICIES",
        description: [
            "Legal stuff: https://openai.com/policies/",
        ]
    },
    {
        title: "DATA PRIVACY",
        description: [
            "Default data retention: https://platform.openai.com/docs/models/default-usage-policies-by-endpoint",
            "Is the data passed into the API stored? https://platform.openai.com/docs/guides/text-generation/do-you-store-the-data-that-is-passed-into-the-api",
            "Privacy policy: https://openai.com/policies/privacy-policy/",
            "Europe privacy policy (EEA, Switzerland, or UK): https://openai.com/policies/eu-privacy-policy/",
            "GPTs Data Privacy FAQs: https://help.openai.com/en/articles/8554402-gpts-data-privacy-faqs"
        ]
    },
    {
        title: "TOKENS",
        description: [
            "Tokens key concept: https://platform.openai.com/docs/concepts/tokens.",
            "More info (managing tokens): https://platform.openai.com/docs/advanced-usage/managing-tokens"
        ]
    },
    {
        title: "MODELS",
        description: [
            "Models: https://platform.openai.com/docs/models",
            "List of models for completions endpoint: https://platform.openai.com/docs/models/model-endpoint-compatibility",
        ]
    },
    {
        title: "TEMPERATURE",
        description: "How should I set the temperature parameter? https://platform.openai.com/docs/guides/text-generation/how-should-i-set-the-temperature-parameter"
    },
    {
        title: "PROMPT ENGINEERING",
        description: "Prompt engineering guide: https://platform.openai.com/docs/guides/prompt-engineering/prompt-engineering",
    },
];

const description = longDescription("Ask a simple question to OpenAI API LLM. Use of /v1/chat/completions endpoint.", topics);

const defaults = {
    maxTokens: 1000,
    model: "gpt-4o-mini",
    temperature: 0.5,
};

const cmd = command({
    name: "generic",
    description: description,
    version: "0.0.2",
    aliases: ["g", "ask", "completions", "chat"],
    args: {
        ...getCommonOptions(),
        maxTokens: option({
            type: optional(number),
            long: "tokens",
            short: "t",
            description: `Maximum number of INPUT tokens to spend. Defaults to ${defaults.maxTokens}.`,
            defaultValue: () => defaults.maxTokens,
        }),
        model: option({
            type: optional(string),
            long: "model",
            short: "m",
            description: `One of the model names listed in the v1/chat/completions endpoint. Defaults to ${defaults.model}.`,
            defaultValue: () => defaults.model,
        }),
        temperature: option({
            type: optional(number),
            long: "temperature",
            short: "T",
            description: `Randomness/Creativity value for the LLM output. Higher the value, the more creative the output. Defaults to ${defaults.temperature}.`,
            defaultValue: () => defaults.temperature,
        }),
        stats: flag({
            short: "s",
            long: "stats",
            description: "Show response stats. Defaults to false.",
            defaultValue: () => false,
        }),
        prompt: positional({
            type: string,
            displayName: "prompt",
            description: longDescription(["The input or instruction for the LLM to initiate or guide an interaction.",
                "This input can take various forms, such as a question, command, statement, or request for information or creativity.",
                "",
                "For example:",
                "  - A question (e.g., \"What is the capital of France?\")",
                "  - A command (e.g., \"Translate this text.\")",
                "  - A statement (e.g., \"Tell me about the weather.\")",
                "  - A request for creativity (e.g., \"Write a short story about a dragon.\")"]),
        }),
    },
    handler: handler,
});

export default cmd;