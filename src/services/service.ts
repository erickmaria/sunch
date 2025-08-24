export interface AIFeatures {
    text: boolean,
    audio: boolean,
    image: boolean,
    files: boolean,
}

export interface Service {
    chatMode: boolean
    features: AIFeatures,
    execute(prompt: string): Promise<string>;
    getApiKey(): string;
    getModel(): string;
    listModels(): Promise<Array<string>>;
}
