import { useMemo, useState } from "react";
import GeminiService from "../services/GeminiService";
import GPTService from "../services/GPTService";
import { useUserSettings } from "./useUserSettings";
import { Service } from "../services/service";

interface OptionGetAnswer {
    chatMode?: boolean
}

export function useGetAnswer({ chatMode }: OptionGetAnswer) {

    const [awaiting, setAwaiting] = useState(false);

    const { getConfigValue } = useUserSettings()

    const genAI = (getConfigValue('models.current') as string).toLowerCase()

    const services = useMemo(() => {

        const svc = Array<Service>()

        if (genAI == 'gemini') {
            svc.push(GeminiService.getInstance())
        } else if (genAI == 'gpt') {
            svc.push(GPTService.getInstance(chatMode))
        } else if (genAI == 'both') {
            svc.push(GeminiService.getInstance(chatMode), GPTService.getInstance(chatMode))
        } else {
            throw new Error('cant instace Generative AI service, invalid value.')
        }

        return svc
    }, [chatMode, genAI])

    const makeQuestion = async (prompt: string): Promise<string[] | undefined> => {

        setAwaiting(true);

        try {

            const answer = Array<string>();

            for (const svc of services) {
                await svc.execute(prompt)
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
        } finally {
            setAwaiting(false)
        }

    }

    return {
        awaiting,
        makeQuestion
    }

}