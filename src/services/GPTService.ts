import { OpenAI } from "openai";
import { ILLMCapabilities, IILLMService } from "./LLMService";

export default class GPTService implements IILLMService {

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
      apiKey: this.getApiKey(),
      dangerouslyAllowBrowser: true
    });
  }

  private static instance: GPTService;
  public static getInstance(chatMode = false): GPTService {
    if (!GPTService.instance) {
      GPTService.instance = new GPTService(chatMode);
    }
    GPTService.instance.chatMode = chatMode
    return GPTService.instance;
  }

  getApiKey(): string {
    return window.system.store.get('models.gpt.apikey') || window.env.SUNCH_GPT_API_KEY || process.env.SUNCH_GPT_API_KEY || "";
  }

  getModel(): string {
    return window.system.store.get('models.gpt.version')
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
          // .filter((model) => model.id.includes("gpt"))
          .map((model) => model.id);

      })
      .catch((error) => {
        throw error;
        //   // Check for specific error types
        //   if (error instanceof RateLimitError) {
        //     console.error(`Rate limit exceeded: ${error.message}`);
        //     // Implement retry logic with exponential backoff here
        //   } else if (error instanceof AuthenticationError) {
        //     console.error(`Authentication failed: ${error.message}`);
        //     console.error("Please check your API key.");
        //   } else if (error instanceof NotFoundError) {
        //     console.error(`Resource not found: ${error.message}`);
        //   } else if (error instanceof BadRequestError) {
        //     console.error(`Bad request: ${error.message}`);
        //   } else if (error instanceof APIConnectionError) {
        //     console.error(`API connection error: ${error.message}`);
        //   } else if (error instanceof APIError) {
        //     // General API errors (e.g., server issues >= 500)
        //     console.error(`OpenAI API Error: ${error.status} - ${error.message}`);
        //   } else {
        //     // Handle other potential errors (e.g., network issues, local exceptions)
        //     console.error("An unexpected error occurred:", error);
        //   }

      });
  }

}
