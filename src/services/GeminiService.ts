import { ContentListUnion, GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import { AIFeatures, Service } from "./service";

export default class GeminiService implements Service {

    private genAI: GoogleGenAI;
    features: AIFeatures = {
        text: true,
        audio: true,
        image: false,
        files: false,
    };
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

        console.log(prompt);

        const systemPromptDefault = `
You are a highly **Solicitous and Proactive** Customer Service Agent.

**Your Personality and Tone:**
1. **Solicitous and Helpful:** Your tone is warm, friendly, polite, and empathetic. Always start with a greeting and validate the user's request before responding.
2. **Clear and Objective:** Provide direct, complete, and easy-to-understand solutions.

**Your Proactive Behavior:**
1. **Anticipation:** After resolving the main query, always anticipate the user's next question or need.
2. **Offer More:** Offer 1 or 2 suggestions for related resources or actions that may be useful.
3. **Open Closing:** End your response by leaving the door open for further assistance. E.g.: "Is there anything else I can do for you today?"

**Your Main Directives:**
1. **Language Rule:** Always respond in the exact language used by the user in their current message.
2. Do not just answer the question; ensure the user feels completely supported.
`;

        let contents: ContentListUnion;

        if (prompt.includes("data:audio/webm;base64")) {

            const base64 = prompt.split(",")[1]

            contents = [{
                role: "user",
                parts: [
                    {
                        inlineData: {
                            data: base64,
                            mimeType: "audio/webm"
                        }
                    },
                    {
                        text: "Resonse audio data"
                    }
                ]
            }];


        } else {
            contents = prompt;
        }


        const response = await this.genAI.models.generateContent({
            model: this.getModel(),
            contents: contents,
            config: {
                safetySettings: this.safetySettings,
                systemInstruction: systemPromptDefault,
            }
        });
        console.log(response.text)
        return Promise.resolve(response.text || '');
    }

    async sendAudioFile(filepath: string): Promise<string> {
        const myfile = await this.genAI.files.upload({
            file: filepath,
            config: {
                mimeType: "audio/mp3"
            },
        });

        const response = await this.genAI.models.generateContent({
            model: this.getModel(),
            contents: [
                { role: "user", parts: [{ text: "Describe this audio clip" }, { fileData: myfile }] }
            ],
        });

        return Promise.resolve(response.text || '');
    }

    async listModels(): Promise<Array<string>> {
        return await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.getApiKey()}`)
            .then(response => response.json())
            .then(data => {

                if (data instanceof Object) {
                    if (Object.prototype.hasOwnProperty.call(data, 'error')) {
                        return [];
                    }
                }
                return (data.models as Array<any>).map((model) => (model.name as string).replaceAll('models/', ''))
            })
            .catch(error => { return error });
    }


}

