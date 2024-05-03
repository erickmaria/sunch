import { useMemo, useState } from "react";
import GeminiService from "../services/GeminiService";
import GPTService from "../services/GPTService";

interface OptionGetAnswer {
    chatMode?: boolean
    genAI: 'GEMINI' | 'GPT'
}

export function useGetAnswer({ chatMode, genAI }: OptionGetAnswer) {

    const [awaiting, setAwaiting] = useState(false);

    const service = useMemo(() => {
        
        const service = new (genAI == 'GEMINI' ? GeminiService : GPTService )(chatMode)


        return service
    }, [chatMode, genAI])

    const makeQuestion = async (prompt: string): Promise<string | undefined> => {

        setAwaiting(true);

        try {
            return await service.execute(prompt)
        } catch (error) {
            if (error instanceof Error){
                throw error
            }
        }finally{
            setAwaiting(false)
        }

}

    return {
        awaiting,
        makeQuestion
    }

}