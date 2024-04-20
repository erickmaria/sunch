export interface Service {
    execute(prompt: string): Promise<string>;
}