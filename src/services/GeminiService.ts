import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { LLMService } from "./LLMService";
import { LanguageModelV2 } from '@ai-sdk/provider';
import { fetchData } from '@/utils/feachData';

export default class GeminiService extends LLMService {

    private constructor(chatMode = false) {
        super(chatMode)
        this.providerOptions = {
            google: {
                safetySettings: [
                    {
                        category: "HARM_CATEGORY_HARASSMENT",
                        threshold: "BLOCK_ONLY_HIGH",
                    },
                    {
                        category: "HARM_CATEGORY_HATE_SPEECH",
                        threshold: "BLOCK_ONLY_HIGH",
                    },
                    {
                        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        threshold: "BLOCK_ONLY_HIGH",
                    },
                    {
                        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                        threshold: "BLOCK_NONE",
                    }
                ]
            },
        }

    }

    provider(): LanguageModelV2 {
        const google = createGoogleGenerativeAI({
            apiKey: this.apiKey(),
        })
        return google(window.system.store.get('models.gemini.version'))
    }

    apiKey(): string {
        return window.system.store.get('models.gemini.apikey') || window.env?.SUNCH_GEMINI_API_KEY || process.env.SUNCH_GEMINI_API_KEY || "";
    }

    async listModels(): Promise<Array<string>> {
        const models = await fetchData({ url: `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey()}` });
        return (models.models as Array<any>)
            .map((model) => (model.name as string).replace(/^models\//, ''))
            .filter(model => (/^(gemini-)([1-9])/).test(model));
    }

    private static instance: GeminiService;
    public static getInstance(chatMode = false): GeminiService {
        if (!GeminiService.instance) {
            GeminiService.instance = new GeminiService(chatMode);
        }
        GeminiService.instance.chatMode = chatMode
        return GeminiService.instance;
    }

}

