import { OpenAI } from "openai";
import { Service } from "./service";

export default class GPTService implements Service {

  private genAI: OpenAI
  chatMode: boolean;

  private constructor(chatMode = false) {

    this.chatMode = chatMode

    this.genAI = new OpenAI({
      apiKey: this.getApiKey(),
      dangerouslyAllowBrowser: true
    });
  }

  private static instance: GPTService;
  public static getInstance(chatMode = false): GPTService {
    if (!GPTService.instance) {
      GPTService.instance = new GPTService(chatMode);
    }
    return GPTService.instance;
  }

  getApiKey(): string {
    return window.system.store.get('models.gpt.apikey') || window.env.SUNCH_GPT_API_KEY || process.env.SUNCH_GPT_API_KEY || "";
  }

  getModel(): string {
    return window.system.store.get('models.gpt.version')
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

  async listModels(): Promise<Array<string>> {
    return await this.genAI.models.list()
      .then((response) => {
        return response.data
          // .filter((model) => model.id.includes("gpt"))
          .map((model) => model.id);

      })
      .catch((error) => {
        console.error("Error listing models:", error);

        return [];
      });
  }

}
