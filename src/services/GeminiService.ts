import { GenerativeModel, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai"
import { Service } from "./service";

export default class GeminiService implements Service {

    private genAI: GoogleGenerativeAI
    private model: GenerativeModel

    constructor() {

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
        ];

        this.genAI = new GoogleGenerativeAI(window.env?.SUNCH_GEMINI_API_KEY || process.env.SUNCH_GEMINI_API_KEY || "")

        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });
    }

    async execute(prompt: string): Promise<string> {

        console.log(window.env?.SUNCH_GEMINI_API_KEY, process.env.SUNCH_GEMINI_API_KEY) 

        const result = await this.model.generateContent(prompt)
        const response = result.response;

        return response.text();
    }
}