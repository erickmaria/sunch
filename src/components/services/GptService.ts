import { Configuration, OpenAIApi } from "openai"

const configuration = new Configuration({
    // apiKey: process.env.OPENAI_API_KEY,
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);


export default async function GetAnswer(prompt: string): Promise<any> {

    return await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 150,
        temperature: 0.9,
      });

}