import { useMemo, useState } from "react";
import GeminiService from "../services/GeminiService";
import GPTService from "../services/GPTService";
import { AIFeatures, Service } from "../services/service";
import ClaudeService from "@/services/ClaudeService";
import OpenRouterService from "@/services/OpenRouterService";

interface OptionGetAnswer {
    id: string
    chatMode: boolean
    genAI: string
}

export function useGetAnswer({ id, chatMode, genAI }: OptionGetAnswer) {

    const [awaiting, setAwaiting] = useState<boolean>(false);
    const [features, setFeatures] = useState<AIFeatures>({} as AIFeatures);

    const services = useMemo(() => {

        const svc = Array<Service>()

        if (genAI == 'gemini') {
            svc.push(GeminiService.getInstance(chatMode))
        } else if (genAI == 'gpt') {
            svc.push(GPTService.getInstance(chatMode))
        } else if (genAI == 'claude') {
            svc.push(ClaudeService.getInstance(chatMode))
        } else if (genAI == 'openrouter') {
            svc.push(OpenRouterService.getInstance(chatMode))
        } else {
            throw new Error('cant instace Generative AI service, invalid value.')
        }
        setFeatures(svc[0].features)

        return svc
    }, [chatMode, genAI])

    const askSomething = async (prompt: string): Promise<string[] | undefined> => {

        setAwaiting(true);

        try {

            const answer = Array<string>();

            for (const svc of services) {
                await svc.execute(id, prompt)
                    .then(data => answer.push(data))
                    .catch(err => {
                        if (err instanceof Error) {
                            answer.push(err.message)
                        }
                    })
            }

            return answer

        } catch (error) {
            if (error instanceof Error) {
                throw error
            }
        } 
        finally {
            setAwaiting(false)
        }

        setAwaiting(false)

    }

    return {
        awaiting,
        askSomething,
        features
    }

}