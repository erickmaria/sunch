import { HfInference } from "@huggingface/inference";

// const inference = new HfInference(process.env.OPENAI_API_KEY);
const inference = new HfInference("");

export default async function GetAnswer(prompt: string): Promise<any> {
    return await inference.translation({
        model: 'openchat/openchat',
        inputs: prompt,
      })
}