import { OpenAI } from "openai";
import { Service } from "./service";

export default class GPTService implements Service {

    private genAI: OpenAI
    chatMode: boolean;

    constructor(chatMode?: boolean) {
        this.chatMode = <boolean>chatMode

        this.genAI = new OpenAI({
            apiKey: window.env?.SUNCH_GPT_API_KEY || process.env.SUNCH_GPT_API_KEY || "",
            dangerouslyAllowBrowser: true
        });
    }

    async execute(prompt: string): Promise<string> {

        const completion = await this.genAI.chat.completions.create({
            messages: [
              {
                role: "system",
                content: "",
              },
              { role: "user", content: prompt },
            ],
            model: "gpt-3.5-turbo",
          });

        return completion.choices[0].message.content || ""
    }
}