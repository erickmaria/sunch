import { useMemo, useState } from "react";
import GeminiService from "../services/GeminiService";

interface OptionGetAnswer {
    chatMode?: boolean
}

export function useGetAnswer({ chatMode }: OptionGetAnswer) {

    const [awaiting, setAwaiting] = useState(false);

    const service = useMemo(() => {
        
        const service = new (GeminiService)(chatMode)

        return service
    }, [])

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