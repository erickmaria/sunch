import { OpenAI } from "openai";
import { Service } from "./service";

export default class GPTService implements Service {

  private genAI: OpenAI
  chatMode: boolean;

  constructor(chatMode?: boolean) {
    this.chatMode = <boolean>chatMode

    this.genAI = new OpenAI({
      apiKey: this.getApiKey(),
      dangerouslyAllowBrowser: true
    });
  }

  getApiKey(): string {
    return window.system.store.get('models.gpt.apikey') || window.env.SUNCH_GPT_API_KEY || process.env.SUNCH_GPT_API_KEY || "";
  }

  getModel(): string {
    return window.system.store.get('models.gpt  .version')
  }

  async execute(prompt: string): Promise<string> {

    if (this.genAI.apiKey != this.getApiKey()) {
      this.genAI.apiKey = this.getApiKey()
    }

    const completion = await this.genAI.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "",
        },
        { role: "user", content: prompt },
      ],
      model: this.getModel(),
    });

    return completion.choices[0].message.content || ""
  }
}