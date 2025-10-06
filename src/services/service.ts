export interface AIFeatures {
    text: boolean,
    audio: boolean,
    image: boolean,
    files: boolean,
}

export interface Service {
    chatMode: boolean
    features: AIFeatures,
    execute(sessionId: string, prompt: string): Promise<string>;
    getApiKey(): string;
    getModel(): string;
    listModels(): Promise<Array<string>>;
}

export function getSystemPrompt() {
    return window.system.store.get(`prompts.${window.system.store.get('prompts._selected_')?.id}`)?.content || `
You are a concise assistant. Always respond clearly, directly, and succinctly, without unnecessary details or explanations. Use short sentences and get straight to the point. If there are options, present only the most relevant ones.
`;
}

 