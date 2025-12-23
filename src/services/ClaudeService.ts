import { createAnthropic } from '@ai-sdk/anthropic';
import { LanguageModelV2 } from '@ai-sdk/provider';
import { LLMService } from "./LLMService";
import { fetchData } from '@/utils/feachData';

export default class ClaudeService extends LLMService {

    private constructor(chatMode = false) {
        super(chatMode)
    }

    provider(): LanguageModelV2 {
        const anthropic = createAnthropic({
            apiKey: this.apiKey(),
            headers: {
                "anthropic-dangerous-direct-browser-access": "true",
            }
        })
        return anthropic(window.system.store.get('models.claude.version'))
    }

    async listModels(): Promise<Array<string>> {
        const claude = await fetchData({
            url: `https://api.anthropic.com/v1/models`,
            headers: {
                "Content-Type": "application/json",
                "anthropic-version": "2023-06-01",
                "anthropic-dangerous-direct-browser-access": "true",
                "X-Api-Key": this.apiKey()
            }
        });
        return (claude.data as Array<any>).map(models => models.id)
    }

    apiKey(): string {
        return window.system.store.get('models.claude.apikey') || window.env?.SUNCH_CLAUDE_API_KEY || process.env.SUNCH_CLAUDE_API_KEY || "";
    }

    private static instance: ClaudeService;
    public static getInstance(chatMode = false): ClaudeService {
        if (!ClaudeService.instance) {
            ClaudeService.instance = new ClaudeService(chatMode);
        }
        ClaudeService.instance.chatMode = chatMode
        return ClaudeService.instance;
    }

}

