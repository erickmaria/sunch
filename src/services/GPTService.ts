import { createOpenAI } from '@ai-sdk/openai';
import { LanguageModelV2 } from '@ai-sdk/provider';
import { LLMService } from "./LLMService";
import { fetchData } from '@/utils/feachData';

export default class GPTService extends LLMService {

  private constructor(chatMode = false) {
    super(chatMode)
  }

  provider(): LanguageModelV2 {
    const openai = createOpenAI({
      apiKey: this.apiKey(),
    })
    return openai(window.system.store.get('models.gpt.version'))
  }

  async listModels(): Promise<Array<string>> {
    const models = await fetchData({
      url: `https://api.openai.com/v1/models`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey()}`
      }
    });

    return (models.data as Array<any>)
      .map(models => models.id)
      .filter(model => (/^(gpt-)([1-9])|(o([1-9]))/).test(model))
      .filter(model => !(/\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/).test(model));
  }

  apiKey(): string {
    return window.system.store.get('models.gpt.apikey') || window.env?.SUNCH_GPT_API_KEY || process.env.SUNCH_GPT_API_KEY || "";
  }

  private static instance: GPTService;
  public static getInstance(chatMode = false): GPTService {
    if (!GPTService.instance) {
      GPTService.instance = new GPTService(chatMode);
    }
    GPTService.instance.chatMode = chatMode
    return GPTService.instance;
  }

}

