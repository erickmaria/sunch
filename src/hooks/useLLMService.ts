import ClaudeService from "@/services/ClaudeService"
import GeminiService from "@/services/GeminiService"
import GPTService from "@/services/GPTService"
import { IILLMService, ILLMCapabilities, LLMProvider, LLMResponses } from "@/services/LLMService"
import OpenRouterService from "@/services/OpenRouterService"
import { useMemo, useState } from "react"

interface UseLLMOptions {
    id: string
    providers: Array<LLMProvider>
    chatMode: boolean
}

export function useLLMService({ id, providers, chatMode }: UseLLMOptions) {

    const [awaiting, setAwaiting] = useState<boolean>(false);

    const services: Map<LLMProvider, IILLMService> = new Map<LLMProvider, IILLMService>([
        ['gpt', GPTService.getInstance(chatMode)],
        ['gemini', GeminiService.getInstance(chatMode)],
        ['claude', ClaudeService.getInstance(chatMode)],
        ['openrouter', OpenRouterService.getInstance(chatMode)]
    ]);

    const llms = useMemo(() => {
        return function () {
            return {
                execute: async (prompt: string, files: Blob[]): Promise<LLMResponses> => {

                    setAwaiting(true)

                    const responses: LLMResponses = new Map<LLMProvider, string>()

                    const promises = Array.from(providers.entries()).map(async ([_, provider]) => {
                        try {
                            const data = await services.get(provider)!.execute(id, prompt, files)
                            responses.set(provider, data)
                        } catch (err) {
                            if (err instanceof Error) {
                                responses.set(provider, err.message)
                            } else {
                                responses.set(provider, String(err))
                            }
                        }
                    })

                    await Promise.all(promises)
                    setAwaiting(false)
                    return responses
                },
                capabilities: () => {

                    const capabilities = new Map<LLMProvider, ILLMCapabilities>()
                    Array.from(services.entries()).map(([key, service]) => {
                        capabilities.set(key, service.capabilities)
                    })

                    return capabilities
                },
                providers: () => [...services.keys()]

            }
        }();
    }, [chatMode, providers])

    const askSomething = async (prompt: string, files: Blob[]) => llms.execute(prompt, files);
    const capabilities = llms.capabilities();
    const listLLmsProviders = llms.providers()

    return {
        awaiting,
        capabilities,
        askSomething,
        listLLmsProviders
    }
}