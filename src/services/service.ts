export interface Service {
    chatMode: boolean
    execute(prompt: string): Promise<string>;
    getApiKey(): string;
    getModel(): string;
}