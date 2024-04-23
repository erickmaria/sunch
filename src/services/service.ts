export interface Service {
    chatMode: boolean
    execute(prompt: string): Promise<string>;
}