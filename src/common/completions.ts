import OpenAI from "openai";
import { Message } from "../entities/Message";
import { countTokens } from "./token";

export async function create(instance: OpenAI, messages: Message[], options = { maxTokens: 1000, model: "gpt-4o-mini", temperature: 0.5 }): Promise<Response> {
    const { maxTokens, model } = options;

    const totalTokens = countTokens(model, messages);

    if (totalTokens > maxTokens) {
        throw new Error(`Total tokens (${totalTokens}) exceeds the maximum tokens allowed (${maxTokens}).`);
    }

    const completion = await instance.chat.completions.create({
        n: 1,
        model: model,
        messages: messages,
        temperature: options.temperature,
        max_completion_tokens: null, // Max total number of all types of tokens
        logprobs: null, // Further research would be useful for quality of completions.
        response_format: undefined, // Further research would be useful for specific output returns as diffs for example.
        stream: false, // Further research would be useful for UX output response as ChatGPT does.
        user: undefined, // Further research would be useful for user abuse detection from OpenAI (Not CLI intended).
    });

    return {
        model: completion.model,
        message: completion.choices[0].message.content ?? "",
        tokens: {
            prompt: completion.usage?.prompt_tokens ?? 0,
            completion: completion.usage?.completion_tokens ?? 0,
            total: completion.usage?.total_tokens ?? 0,
            reasoining: completion.usage?.completion_tokens_details?.reasoning_tokens ?? 0,
        }
    }
}

type Response = {
    model: string;
    message: string;
    tokens: {
        prompt: number;
        completion: number;
        total: number;
        reasoining: number;
    }
}