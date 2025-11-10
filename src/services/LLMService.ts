export type LLMProvider = "gpt" | "gemini" | "claude" | "openrouter"
export type LLMResponses = Map<LLMProvider, string>

export interface ILLMCapabilities {
    context: boolean,
    text: boolean,
    audio: boolean,
    // image: boolean,
    file: boolean,
}


export interface IILLMService {
    chatMode: boolean
    capabilities: ILLMCapabilities,
    execute(sessionId: string, prompt: string, files?: Base64URLString[] | Blob[]): Promise<string>;
    getApiKey(): string;
    getModel(): string;
    listModels(): Promise<Array<string>>;
}

export function getSystemPrompt() {
    return window.system.store.get(`prompts.${window.system.store.get('prompts._selected_')?.id}`)?.content || `You are a concise assistant. Always respond clearly, directly, and succinctly, without unnecessary details or explanations. Use short sentences and get straight to the point. If there are options, present only the most relevant ones.`;
}

export function getAudioSystemPrompt() {
    return window.system.store.get(`prompts.${window.system.store.get('prompts._selected_')?.id}`)?.content || `Transcribe the audio. Following the transcription, analyze its content and the speaker's intent, and then provide a **respond clearly and succinctly** to the user.`;
}