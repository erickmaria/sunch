import express from 'express'
import bodyParser from 'body-parser'
import { chat, init } from './chat.mjs'


const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const port = process.env.SERVER_PORT | 3080

const { browser, page } = await init()

app.post('/chat', async (req, res) => {

    const { email, password } = req.body

    console.log(req.body, req.query)

    try {

        const err = chat(browser, page, req.query.prompt, {
            email: email, 
            password: password
        })

        if (err != "") {
            res.send({"errorMessage": err}).status(500)
        }
        
    }catch(e) {

        res.send({"errorMessage": e}).status(500)

    }

    res.sendStatus(200)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
