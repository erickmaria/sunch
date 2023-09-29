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
    browser.si
    const page = await browser.newPage()
    await page.setJavaScriptEnabled(true)

    return { browser, page }
}

/**
 * @param {Page} page
 * @param {Browser} browser
 * @param {{user, pass}}
 */
export async function login(browser, page,  {user, pass}) {

    try {

        console.time("time")
        process.stdout.write("Initializing ChatGPT... ")

        await page.goto('https://chat.openai.com/', { waitUntil: 'domcontentloaded' })

        await page.waitForTimeout(1000)
        const login = await page.waitForSelector('[data-testid="login-button"]')
        login.click()

        await page.waitForTimeout(1000)
        await page.waitForSelector('input[name=username]')
        await page.type('input[name=username]', user)

        await page.waitForTimeout(1000)
        await page.click('[data-action-button-primary="true"]')

        await page.reload()

        await page.waitForTimeout(1000)
        await page.type('input[id=password]', pass)

        await page.waitForTimeout(1000)
        await page.click('[data-action-button-primary="true"]')

        await page.waitForTimeout(1000)
        const textSelector = await page.waitForSelector(
            "text/Okay, let’s go"
        )
        textSelector.click()

        console.timeEnd("time")
        console.log("Ready to ask questions!")

        return ""

    } catch (err) {
        await browser.close()

        console.log(err)

        return err.toString()
    }

}

/**
 * @param {Page} page
 * @param {Browser} browser
 */
export async function chat(browser, page, message) {

    // const chatText = await page.waitForSelector('div>ol>li>a>div.text-ellipsis')
    // chatText.click()

    // await page.waitForTimeout(2000)

    try {

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

        return ""

    } catch (err) {
        await browser.close()

        console.log(err)

        return err.toString()
    }
}

// const { browser, page } = await init()
// await login(browser, page)

// await chat(browser, page, 'how is java?')



// await page.evaluate(() => {
//     return document.querySelector('div>ol>li>a>div.text-ellipsis').innerHTML = 'test aaaa'
// })

// const chats = await page.evaluate(() => {
//     return  document.querySelectorAll('')[0]
// })

// console.log(chats)

// await chat(browser, page, 'hello')
// await chat(browser, page, 'give a exemple of a code in java')

// const elements = await page.evaluate(() => {
//     const elementsWithClass = Array.from(document.querySelectorAll('div.markdown'))
//     return elementsWithClass.map(element => element.textContent)
// })

// console.log(elements)
