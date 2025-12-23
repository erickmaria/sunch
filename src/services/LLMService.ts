import { blobToBase64 } from "@/utils/blobToBase64";
import { JSONValue, LanguageModelV2 } from "@ai-sdk/provider";
import { convertToModelMessages, FileUIPart, generateText, UIDataTypes, UIMessage, UITools } from "ai";

export type LLMProvider = "gpt" | "gemini" | "claude" | "openrouter"
export type LLMResponses = Map<LLMProvider, string>

export interface ILLMCapabilities {
    context: boolean,
    text: boolean,
    audio: boolean,
    // image: boolean,
    file: boolean,
}

export interface IILLMService {
    chatMode: boolean
    capabilities: ILLMCapabilities,
    execute(sessionId: string, prompt: string, files?: Base64URLString[] | Blob[]): Promise<string>;
    provider(): LanguageModelV2;
    listModels(): Promise<Array<string>>;
}

export abstract class LLMService implements IILLMService {

    chatHistory: Array<UIMessage>;
    providerOptions?: Record<string, Record<string, JSONValue>>;
    chatMode: boolean;
    capabilities: ILLMCapabilities = {
        context: true,
        text: true,
        audio: true,
        // image: true,
        file: true,
    };

    constructor(chatMode = false) {
        this.chatHistory = []
        this.chatMode = chatMode
    }

    abstract provider(): LanguageModelV2;
    abstract listModels(): Promise<Array<string>>;
    abstract apiKey(): string;

    async execute(sessionId: string, prompt: string, files?: Base64URLString[] | Blob[]): Promise<string> {

        let filesPart: FileUIPart[] = []
        if (files != undefined && Array.isArray(files) && files.every(file => file instanceof Blob)) {
            filesPart = await fileToPart(files)
        }
        const imagesParts = extractImagesFromText(prompt)

        const messagePart: UIMessage<UIDataTypes, UITools> = prompt.includes("data:audio/webm;base64") ?
            { id: sessionId, role: "user", parts: [{ type: "file", url: prompt, mediaType: 'audio/webm' }] } :
            {
                id: sessionId, role: "user", parts: [
                    { type: 'text', text: prompt },
                    ...imagesParts.map(image => ({ type: 'file' as const, mediaType: image.mediaType, url: image.url })),
                    ...filesPart.map(parts => ({ type: 'file' as const, mediaType: parts.mediaType, url: parts.url }))
                ]
            }


        if (this.chatMode) {
            if (this.chatHistory.length == 0) {
                this.chatHistory.push({
                    id: sessionId,
                    role: "system", parts: [{
                        type: "text",
                        text: SystemPrompt()
                    }],
                })
            }
            this.chatHistory.push(messagePart)
        } else {
            this.chatHistory = [
                { id: sessionId, role: "system", parts: [{ type: "text", text: SystemPrompt() }] }, messagePart
            ]
        }

        const { response } = await generateText({
            model: this.provider(),
            messages: convertToModelMessages(this.chatHistory),
            providerOptions: this.providerOptions
        })

        let answer = "";
        if (response.messages.length > 0) {
            if (typeof response.messages[0].content === "string") {
                answer = response.messages[0].content;
            } else {
                const firstPart = response.messages[0].content[0];
                if (firstPart && 'text' in firstPart) {
                    answer = firstPart.text;
                    this.chatHistory.push({
                        id: sessionId,
                        role: "assistant", parts: [{ type: "text", text: answer }]
                    })
                } else {
                    // Handle cases where the first part might not have a 'text' property
                    answer = JSON.stringify(firstPart);
                }
            }
        }

        return answer;
    }

    isLanguageModelV2(variable: any): variable is LanguageModelV2 {
        return (
            typeof variable === 'object' && // Check if it's an object
            variable !== null && // Ensure it's not null
            'generate' in variable && // Check for the existence of required properties using 'in'
            typeof variable.generate === 'function' && // Check the type of the property
            'modelName' in variable &&
            typeof variable.modelName === 'string'
        );
    }

}

function extractImagesFromText(text: string): FileUIPart[] {
    const imageRegex = /!\[[^\]]*\]\((?<url>[^)]+)\)|<img[^>]*src=["'](?<src>[^"']+)["'][^>]*>|(?<direct>https?:\/\/[^\s]+\.(?:png|jpe?g|gif|svg|webp|bmp|ico))/gi;
    const matches: FileUIPart[] = [];

    const seen = new Set<string>();
    let match: RegExpExecArray | null;

    while ((match = imageRegex.exec(text)) !== null) {
        const url = match.groups?.url || match.groups?.src || match.groups?.direct;
        if (!url || seen.has(url)) continue;

        seen.add(url);

        const cleanUrl = url.split(/[?#]/)[0]; // remove query strings/fragments for filename
        const filename = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1) || "unknown";
        const extMatch = filename.match(/\.(\w+)$/);
        const ext = extMatch ? extMatch[1].toLowerCase() : "png";

        const mediaType = `image/${ext === "jpg" ? "jpeg" : ext}`;

        matches.push({
            type: "file",
            filename,
            mediaType,
            url,
        });
    }

    return matches;
}

async function fileToPart(files: Blob[]): Promise<FileUIPart[]> {
    // if (!Array.isArray(files) || !files.every(file => file instanceof Blob)) {
    //     return [];
    // }

    const converted: Array<FileUIPart> = await Promise.all(files.map(async (f) => {
        try {
            const base64String = await blobToBase64(f);
            console.log(base64String)
            // const pureBase64 = (base64String as string).split(',')[1];
            return {
                url: base64String,
                mediaType: f.type.length == 0 ? "text/plain" : f.type
            } as FileUIPart;
        } catch (error) {
            console.error('Error converting blob to base64 for file:', f, error);
            throw error;
        }
    }));

    return converted;
}

export function SystemPrompt() {
    return window.system.store.get(`prompts.${window.system.store.get('prompts._selected_')?.id}`)?.content || `You are a concise assistant. Always respond clearly, directly, and succinctly, without unnecessary details or explanations. Use short sentences and get straight to the point. If there are options, present only the most relevant ones.`;
}

export function AudioSystemPrompt() {
    return window.system.store.get(`prompts.${window.system.store.get('prompts._selected_')?.id}`)?.content || `Transcribe the audio. Following the transcription, analyze its content and the speaker's intent, and then provide a **respond clearly and succinctly** to the user.`;
}