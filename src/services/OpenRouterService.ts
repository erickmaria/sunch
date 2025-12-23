import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { LanguageModelV2 } from '@ai-sdk/provider';
import { LLMService } from "./LLMService";
import { fetchData } from '@/utils/feachData';

export default class OpenRouterService extends LLMService {

    private constructor(chatMode = false) {
        super(chatMode)
    }

    provider(): LanguageModelV2 {
        const openrouter = createOpenRouter({
            apiKey: this.apiKey()
        })
        return openrouter(window.system.store.get('models.openrouter.version'))
    }

    async listModels(): Promise<Array<string>> {
        const models = await fetchData({ url: `https://openrouter.ai/api/v1/models` });
        console.log(models)
        return (models.data as Array<any>).filter(models => {
            const f = (models.architecture.output_modalities as Array<string>)
            return f.length == 1 && f.includes("text")
        }).map(data => data?.id)
    }

    apiKey(): string {
        return window.system.store.get('models.openrouter.apikey') || window.env?.SUNCH_OPENROUTER_API_KEY || process.env.SUNCH_OPENROUTER_API_KEY || "";
    }

    private static instance: OpenRouterService;
    public static getInstance(chatMode = false): OpenRouterService {
        if (!OpenRouterService.instance) {
            OpenRouterService.instance = new OpenRouterService(chatMode);
        }
        OpenRouterService.instance.chatMode = chatMode
        return OpenRouterService.instance;
    }

}

