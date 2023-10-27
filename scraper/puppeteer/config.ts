import { Browser, Page } from "puppeteer"
import puppeteer from 'puppeteer-extra'
import pluginStealth from 'puppeteer-extra-plugin-stealth'
import { BasicAuth } from "./auth"

puppeteer.use(pluginStealth())

// const scrap_debug = process.env.SCRAP_DEBUG || true;

class ScrapConfig {

    private browser: Browser
    private page: Page
    private static instance: ScrapConfig

    private constructor() {
        this.Init().catch(err => {
            throw new Error(err.toString());
        })
    }

    private async Init() {

        try {

            this.browser = await puppeteer.launch({
                headless: true,
                userDataDir: "./user_data",
                args: [
                    '--no-sandbox',
                    '--disable-dev-shm-usage',
                    // '--window-size=400,600'
                ],
            })

            this.page = await this.browser.newPage()
            this.page.setCacheEnabled(true)
            await this.page.setJavaScriptEnabled(true)

        } catch (error) {

            await this.browser.close()

            console.log(error)

            return new Error(error?.toString())
        }

        return null
    }

    public async Login(auth: BasicAuth): Promise<Error | string | null> {

        process.stdout.write("Logining, ChatGPT...\n ")

        try {

            await this.page.goto('https://chat.openai.com', { waitUntil: 'domcontentloaded' })

            if (!this.page.url().includes('auth/login')) {

                const authenticated = "already authenticated"
                
                console.log(authenticated)
                return "already authenticated"
            }

            await this.page.waitForTimeout(1000)
            let login = await this.page.waitForSelector('[data-testid="login-button"]')
            login?.click()

            await this.page.waitForTimeout(1000)
            await this.page.waitForSelector('input[name=username]')
            await this.page.type('input[name=username]', auth.email)

            await this.page.waitForTimeout(1000)
            await this.page.click('[data-action-button-primary="true"]')

            await this.page.reload()

            await this.page.waitForTimeout(1000)
            await this.page.type('input[id=password]', auth.password)

            await this.page.waitForTimeout(1000)
            await this.page.click('[data-action-button-primary="true"]')

            await this.page.waitForTimeout(1000)
            let textSelector = await this.page.waitForSelector(
                "text/Okay, let’s go"
            )
            textSelector?.click()

            console.timeEnd("time")
            console.log("Ready to ask questions!")
        } catch (error) {

            // await this.browser.close()

            console.log(error)

            return new Error(error?.toString())
        }

        return null
    }

    public async Prompt(message: string): Promise<Error | string | null> {

        let response: any

        try {

            console.time("time")
            process.stdout.write("Prompting, ChatGPT...\n ")

            if (!this.page.url().includes('chat.openai.com/c/')) {

                await this.page.goto('https://chat.openai.com/', { waitUntil: 'domcontentloaded' })

                if (this.page.url().includes('auth/login')) {
                    return new Error("you're not authenticated!")
                }

                await this.page.waitForTimeout(1000)
                let chatText = await this.page.waitForSelector('div>ol>li>a>div.text-ellipsis')
                chatText?.click()

                await this.page.waitForTimeout(2000)
            }

            console.log("user: " + message)

            await this.page.waitForTimeout(500)
            await this.page.waitForSelector('textarea[id=prompt-textarea]')
            await this.page.type('textarea[id=prompt-textarea]', message)

            await this.page.waitForTimeout(500)
            let send = await this.page.waitForSelector('[data-testid="send-button"]')
            send?.click()

            await this.page.waitForTimeout(500)
            while (true) {
                const loading = await this.page.evaluate(() => {
                    return document.querySelectorAll('button.btn-neutral>div')[0].textContent
                })

                if (loading == "Regenerate") {
                    break
                }
            }

            await this.page.waitForTimeout(500)
            response = await this.page.evaluate(() => {
                const elementsWithClass = Array.from(document.querySelectorAll('.markdown'))
                return elementsWithClass.map(element => element.textContent).pop()
            })

            console.log("assistant: " + response)

        } catch (error) {

            // await this.browser.close()

            console.log(error)

            return new Error(error?.toString())
        }

        return response as string

    }

    public static getInstance(): ScrapConfig {
        if (!this.instance) {
            return new ScrapConfig()
        }
        return this.instance

    }

}

export const scrap: ScrapConfig = ScrapConfig.getInstance()