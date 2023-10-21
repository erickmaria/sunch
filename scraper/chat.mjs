import { Browser, Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import pluginStealth from 'puppeteer-extra-plugin-stealth'

puppeteer.use(pluginStealth())

export async function init() {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            // '--window-size=400,600'
        ],

    })
    const page = await browser.newPage()
    await page.setJavaScriptEnabled(true)

    return { browser, page }
}

/**
 * @param {Page} page
 * @param {Browser} browser
 * @param {{email, password}}
 * @returns {Error | string }
 */
export async function chat(browser, page, message, { email, password }) {

    var err

    try {

        console.time("time")
        process.stdout.write("Initializing ChatGPT... ")

        await page.goto('https://chat.openai.com/', { waitUntil: 'domcontentloaded' })

        if (page.url().includes('auth/login')) {

            await page.waitForTimeout(1000)
            const login = await page.waitForSelector('[data-testid="login-button"]')
            login.click()

            await page.waitForTimeout(1000)
            await page.waitForSelector('input[name=username]')
            await page.type('input[name=username]', email)

            await page.waitForTimeout(1000)
            await page.click('[data-action-button-primary="true"]')

            await page.reload()

            await page.waitForTimeout(1000)
            await page.type('input[id=password]', password)

            await page.waitForTimeout(1000)
            await page.click('[data-action-button-primary="true"]')

            await page.waitForTimeout(1000)
            const textSelector = await page.waitForSelector(
                "text/Okay, let’s go"
            )
            textSelector.click()

            console.timeEnd("time")
            console.log("Ready to ask questions!")
        }

        await page.waitForTimeout(1000)
        const chatText = await page.waitForSelector('div>ol>li>a>div.text-ellipsis')
        chatText.click()

        await page.waitForTimeout(2000)

        console.log("user: " + message)

        await page.waitForTimeout(1000)
        await page.waitForSelector('textarea[id=prompt-textarea]')
        await page.type('textarea[id=prompt-textarea]', message)

        await page.waitForTimeout(1000)
        const send = await page.waitForSelector('[data-testid="send-button"]')
        send.click()

        await page.waitForTimeout(2000)
        while (true) {
            const loading = await page.evaluate(() => {
                return document.querySelectorAll('button.btn-neutral>div')[0].textContent
            })

            if (loading == "Regenerate") {
                break
            }
        }

        await page.waitForTimeout(1000)
        const response = await page.evaluate(() => {
            const elementsWithClass = Array.from(document.querySelectorAll('.markdown'))
            return elementsWithClass.map(element => element.textContent).pop()
        })

        console.log("assistant: " + response)


    } catch (err) {
        await browser.close()

        console.log(err)

        return err.toString()
    }

    return ''
}
