import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import { Service } from "./service";

export default class GeminiService implements Service {

    private genAI: GoogleGenAI;
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

    private constructor(chatMode = false) {
        this.chatMode = chatMode
        this.genAI = new GoogleGenAI({ apiKey: this.getApiKey() })
    }
    private static instance: GeminiService;
    public static getInstance(chatMode = false): GeminiService {
        if (!GeminiService.instance) {
            GeminiService.instance = new GeminiService(chatMode);
        }
        return GeminiService.instance;
    }

    getApiKey(): string {
        return window.system.store.get('models.gemini.apikey') || window.env?.SUNCH_GEMINI_API_KEY || process.env.SUNCH_GEMINI_API_KEY || ""
    }

    getModel(): string {
        return window.system.store.get('models.gemini.version')
    }

    async execute(prompt: string): Promise<string> {

        const response = await this.genAI.models.generateContent({
            model: this.getModel(), contents: prompt, config: {
                safetySettings: this.safetySettings
            }
        });
        // console.log(response.text)
        return Promise.resolve(response.text || '');

    // return await fetch(`/markdowns/1.md`)
    //   .then((res) => {return res.text()})
    //   .catch((err) => {return err});
    }


    async listModels(): Promise<Array<string>> {
        return await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.getApiKey()}`)
            .then(response => response.json())
            .then(data => {
                
               if (data instanceof Object){
                 if (Object.prototype.hasOwnProperty.call(data, 'error')){
                    return [];
                 }
               }
                return (data.models as Array<any>).map((model) => (model.name as string).replaceAll('models/', ''))
            })
            .catch(error => { return error });
    }

}