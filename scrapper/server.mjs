import express from 'express'
import { chat, init, login } from './data.mjs'
const app = express()
const port = 3000

const { browser, page } = await init()

app.get('/login', async (req, res) => {

    const err = await login(browser, page, {user: '', pass: ''})

    if (err != "") {
        res.send({"errorMessage": err}).status(500)
    }

    res.sendStatus(200)
})

app.get('/chat', async (req, res) => {

    const err = chat(browser, page, req.query.prompt)

    if (err != "") {
        res.send({"errorMessage": err}).status(500)
    }
    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
