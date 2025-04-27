export interface Service {
    chatMode: boolean
    execute(prompt: string): Promise<string>;
    getApiKey(): string;
    getModel(): string;
    listModels(): Promise<Array<string>>;
}
