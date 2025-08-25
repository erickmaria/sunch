import Anthropic from '@anthropic-ai/sdk';
import { Service, AIFeatures } from "./service";

export default class ClaudeService implements Service {

  private genAI: Anthropic
  chatMode: boolean;
  features: AIFeatures = {
    text: true,
    audio: false,
    image: false,
    files: false,
  };

  private constructor(chatMode = false) {

    this.chatMode = chatMode

    this.genAI = new Anthropic({
      apiKey: this.getApiKey(),
      dangerouslyAllowBrowser: true
    });
  }

  private static instance: ClaudeService;
  public static getInstance(chatMode = false): ClaudeService {
    if (!ClaudeService.instance) {
      ClaudeService.instance = new ClaudeService(chatMode);
    }
    ClaudeService.instance.chatMode = chatMode
    return ClaudeService.instance;
  }

  getApiKey(): string {
    return window.system.store.get('models.claude.apikey') || window.env.SUNCH_CLAUDE_API_KEY || process.env.SUNCH_CLAUDE_API_KEY || "";
  }

  getModel(): string {
    return window.system.store.get('models.claude.version')
  }

  async execute(sessionId: string, prompt: string): Promise<string> {

    if (this.genAI.apiKey != this.getApiKey()) {
      this.genAI.apiKey = this.getApiKey()
    }

    const message = await this.genAI.messages.create({
      max_tokens: 1024,
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: '' }
      ],
      model: this.getModel(),
    });

    const text = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    return text || "";
  }

  async listModels(): Promise<Array<string>> {
    return await this.genAI.models.list()
      .then((response) => {
        return response.data
          .map((model) => model.id);

      })
      .catch((error) => {
        console.error("Error listing models:", error);

        return [];
      });
  }

}
