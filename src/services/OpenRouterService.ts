import { OpenAI } from "openai";
import { ILLMCapabilities, IILLMService } from "./LLMService";

export default class OpenRouterService implements IILLMService {

  private genAI: OpenAI
  chatMode: boolean;
  capabilities: ILLMCapabilities = {
    text: true,
    audio: false,
    image: false,
    file: false,
  };

  private constructor(chatMode = false) {

    this.chatMode = chatMode

    this.genAI = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: this.getApiKey(),
      dangerouslyAllowBrowser: true
    });
  }

  private static instance: OpenRouterService;
  public static getInstance(chatMode = false): OpenRouterService {
    if (!OpenRouterService.instance) {
      OpenRouterService.instance = new OpenRouterService(chatMode);
    }
    OpenRouterService.instance.chatMode = chatMode
    return OpenRouterService.instance;
  }

  getApiKey(): string {
    return window.system.store.get('models.openrouter.apikey') || window.env.SUNCH_OPENROUTER_API_KEY || process.env.SUNCH_OPENROUTER_API_KEY || "";
  }

  getModel(): string {
    return window.system.store.get('models.openrouter.version')
  }

  async execute(sessionId: string, prompt: string): Promise<string> {

    // eslint-disable-next-line no-empty
    if (sessionId) { }

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
          .map((model) => model.id);
      })
      .catch((error) => {
        console.error("Error listing models:", error);

        return [];
      });
  }

}
