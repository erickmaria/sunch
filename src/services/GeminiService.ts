import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai"
import { Service } from "./service";

export default class GeminiService implements Service {

    private genAI: GoogleGenerativeAI;
    chatMode: boolean;
    private safetySettings = [
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

    constructor(chatMode?: boolean) {
        this.chatMode = <boolean>chatMode
        this.genAI = new GoogleGenerativeAI(this.getApiKey())
    }

    getApiKey(): string {
        return window.system.store.get('models.gemini.apikey') || window.env?.SUNCH_GEMINI_API_KEY || process.env.SUNCH_GEMINI_API_KEY || ""
    }

    getModel(): string {
        return window.system.store.get('models.gemini.version')
    }

    async execute(prompt: string): Promise<string> {

        if (this.genAI.apiKey != this.getApiKey()) {
            this.genAI.apiKey = this.getApiKey()
        }
        
        const model = this.genAI.getGenerativeModel({ model: this.getModel(), safetySettings: this.safetySettings });

        const result = await model.generateContent(prompt)
        const response = result.response;

        return response.text();
    }
}