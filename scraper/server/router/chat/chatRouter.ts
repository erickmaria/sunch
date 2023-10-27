import { Request, Response } from "express";
import { scrap } from "../../../puppeteer/config";

class ChatRouter {

  public async Login(req: Request, res: Response) {

    const { email, password } = req.body
    let result: string | Error | null


    try {

      result = await scrap.Login({
        email: email,
        password: password
      })

      if (result instanceof Error) {
        return res.status(500).send({ "errorMessage": result.toString() })
      }

    } catch (error) {

      return res.status(500).send({ "errorMessage": error?.toString() })

    }

    return res.status(200).send({ "result": result })
  }

  public async Prompt(req: Request, res: Response) {

    const { message } = req.body

    let result: string | Error | null

    try {

      result = await scrap.Prompt(message as string)
      if (result instanceof Error) {
        console.log(result)
        return res.status(400).send({ "errorMessage": result.toString() })
      }

    } catch (error) {

      return res.status(500).send({ "errorMessage": error?.toString() })
    
    }

    return res.status(200).send({ "result": result })
  }

}

export const chatRouter = new ChatRouter();
