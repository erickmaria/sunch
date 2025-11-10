import { Chat, ContentListUnion, GenerateContentResponse, GoogleGenAI, HarmBlockThreshold, HarmCategory, Part } from '@google/genai';
import { IILLMService, ILLMCapabilities, getSystemPrompt } from "./LLMService";
import { blobToBase64 } from '@/utils/blobToBase64';

export default class GeminiService implements IILLMService {

    private chatSessions: Map<string, Chat> = new Map();

    private genAI: GoogleGenAI;
    capabilities: ILLMCapabilities = {
        context: true,
        text: true,
        audio: true,
        // image: true,
        file: true,
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
        GeminiService.instance.chatMode = chatMode
        return GeminiService.instance;
    }

    getApiKey(): string {
        return window.system.store.get('models.gemini.apikey') || window.env?.SUNCH_GEMINI_API_KEY || process.env.SUNCH_GEMINI_API_KEY || ""
    }

    getModel(): string {
        return window.system.store.get('models.gemini.version')
    }

    async execute(sessionId: string, prompt: string, files?: Base64URLString[] | Blob[]): Promise<string> {

        let parts: Part[] = []
        if (files != undefined && Array.isArray(files) && files.every(file => file instanceof Blob)) {
            parts = await this.fileToGenerativePart(files)
        }

        let isAudio = false;
        let contents: ContentListUnion;
        if (prompt.includes("data:audio/webm;base64")) {
            isAudio = true
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
                ]
            }];
        } else {
            parts.push({
                text: prompt
            })
            contents = [{
                role: "user",
                parts: parts
            }];
        }

        let response: GenerateContentResponse
        if (this.chatMode) {
            let chat: Chat;
            if (this.chatSessions.has(sessionId)) {
                chat = this.chatSessions.get(sessionId)!;
            } else {
                chat = this.genAI.chats.create({
                    model: this.getModel(),
                    config: {
                        safetySettings: this.safetySettings,
                        systemInstruction: getSystemPrompt(),
                    }
                });
                this.chatSessions.set(sessionId, chat);
            }

            response = await chat.sendMessage({
                message: [...parts, { text: prompt }]
            });
        } else {
            response = await this.genAI.models.generateContent({
                model: this.getModel(),
                contents: contents,
                config: {
                    safetySettings: this.safetySettings,
                    systemInstruction: isAudio ? getSystemPrompt() : getSystemPrompt(),
                    // CONTEXT CHACHING
                    // cachedContent: cache!.name,
                }
            });
        }

        return Promise.resolve(response!.text || '');
    }

    async fileToGenerativePart(files: Blob[]): Promise<Part[]> {
        if (!Array.isArray(files) || !files.every(file => file instanceof Blob)) {
            return [];
        }

        const parts: Array<Part> = await Promise.all(files.map(async (f) => {
            try {
                const base64String = await blobToBase64(f);
                const pureBase64 = (base64String as string).split(',')[1];
                return {
                    inlineData: {
                        data: pureBase64,
                        mimeType: f.type.length == 0 ? "text/plain" : f.type
                    }
                } as Part;
            } catch (error) {
                console.error('Error converting blob to base64 for file:', f, error);
                throw error;
            }
        }));
        return parts;
    }

    async listModels(): Promise<Array<string>> {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.getApiKey()}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error.message);
            }

            return (data.models as Array<any>).map((model) =>
                (model.name as string).replace(/^models\//, '')
            );
        } catch (error) {
            throw new Error((error as any).message);
        }
    }

    // CONTEXT CHACHING
    // async getOrCreateCache(): Promise<CachedContent> {
    //     const cacheName = "cachebot-system-instruction-v1";

    //     try {
    //         // Tenta recuperar um cache existente pelo nome (ID)
    //         console.log(`Buscando cache existente: ${cacheName}...`);
    //         const existingCache = await this.genAI.caches.get({ name: cacheName });

    //         console.log(`✅ Cache encontrado! Usando o cache ID: ${existingCache.name}`);
    //         return existingCache;

    //     } catch (error) {
    //         // Se a recuperação falhar (cache não encontrado ou expirado), cria um novo
    //         console.log("Cache não encontrado ou erro. Criando um novo cache...");

    //         // ATENÇÃO: O conteúdo a ser armazenado em cache deve ter um mínimo de tokens
    //         // (atualmente 1024 para modelos 2.5 Flash) para que o caching explícito seja efetivo e funcione.
    //         const newCache = await this.genAI.caches.create({
    //             model: this.getModel(),
    //             config: {
    //                 displayName: cacheName,
    //                 systemInstruction: SYSTEM_INSTRUCTION_CONTENT,
    //                 // contents: [{
    //                 //     role: "user",
    //                 //     // parts: [{ text: "" }],
    //                 // }],
    //                 ttl: "86400s",
    //             }
    //         });

    //         console.log(`✨ Cache criado com sucesso! Cache ID: ${newCache.name}`);
    //         return newCache;
    //     }
    // }

    // async sendAudioFile(filepath: string): Promise<string> {
    //     const myfile = await this.genAI.files.upload({
    //         file: filepath,
    //         config: {
    //             mimeType: "audio/mp3"
    //         },
    //     });

    //     const response = await this.genAI.models.generateContent({
    //         model: this.getModel(),
    //         contents: [
    //             { role: "user", parts: [{ text: "Describe this audio clip" }, { fileData: myfile }] }
    //         ],
    //     });

    //     return Promise.resolve(response.text || '');
    // }

    // async getOrCreateChat(): Promise<Chat> {
    //     return this.genAI.chats.create({
    //         model: this.getModel(),
    //     });
    // }

}

