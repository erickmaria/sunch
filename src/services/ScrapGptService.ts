export default class ScrapGptService implements Service {

    private url: string

    constructor(){
        this.url = import.meta.env.SUNCH_SCRAPGPT_API_KEY || "http://localhost:3080"
    }

    async GetAnswer(prompt: string): Promise<string> {
        
        const response = await fetch(`${this.url}/api/prompt`, {
            method: "POST",
            headers: {
              Accept: 'application.json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: prompt
            })
          }).then(response => response)

        return response.text();
    }
}