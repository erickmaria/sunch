interface Service {
    GetAnswer(prompt: string): Promise<string>;
}