import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai"

export default class GeminiService implements Service {

    private genAI: GoogleGenerativeAI 
    private model: GenerativeModel

    constructor(){
        this.genAI = new GoogleGenerativeAI(window.env.SUNCH_GEMINI_API_KEY || "")
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro"});
    }

    async GetAnswer(prompt: string): Promise<string> {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
}