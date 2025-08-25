import { Chat, ContentListUnion, GenerateContentResponse, GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import { AIFeatures, Service, SYSTEM_INSTRUCTION_CONTENT } from "./service";

export default class GeminiService implements Service {

    private chatSessions: Map<string, Chat> = new Map();

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
        GeminiService.instance.chatMode = chatMode
        return GeminiService.instance;
    }

    getApiKey(): string {
        return window.system.store.get('models.gemini.apikey') || window.env?.SUNCH_GEMINI_API_KEY || process.env.SUNCH_GEMINI_API_KEY || ""
    }

    getModel(): string {
        return window.system.store.get('models.gemini.version')
    }

    async execute(sessionId: string, prompt: string): Promise<string> {

        // CONTEXT CHACHING
        // let cache: CachedContent;
        // if (this.cacheMode) {
        //     try {
        //         cache = await this.getOrCreateCache();
        //     } catch (err) {
        //         // console.error(":", err);
        //         return Promise.resolve('fatal error creating/retrieving cache:' + err);;
        //     }
        // }

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

        let response: GenerateContentResponse
        if (this.chatMode) {
            let chat: Chat;
            if (this.chatSessions.has(sessionId)) {
                chat = this.chatSessions.get(sessionId)!;

                // const chat = this.chatSessions.get(sessionId);
                // const history = await chat!.getHistory();
                // const formattedHistory = history.map((content: Content) => ({
                //     role: content.role,
                //     text: content.parts ? content.parts.map(p => p.text).join('') : '',
                // }));
            } else {
                chat = this.genAI.chats.create({
                    model: this.getModel(),
                    config: {
                        safetySettings: this.safetySettings,
                        systemInstruction: SYSTEM_INSTRUCTION_CONTENT,
                    }
                });
                this.chatSessions.set(sessionId, chat);
            }

            response = await chat.sendMessage({
                message: prompt
            });
        } else {
            response = await this.genAI.models.generateContent({
                model: this.getModel(),
                contents: contents,
                config: {
                    safetySettings: this.safetySettings,
                    systemInstruction: SYSTEM_INSTRUCTION_CONTENT,
                    // CONTEXT CHACHING
                    // cachedContent: cache!.name,
                }
            });
        }

        console.log(response!.text)
        return Promise.resolve(response!.text || '');
    }

    async getOrCreateChat(): Promise<Chat> {
        return this.genAI.chats.create({
            model: this.getModel(),
        });
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

