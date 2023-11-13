import express, { Request, Response, NextFunction } from "express";
import { router } from "./router/router";
import bodyParser from 'body-parser';

const allowCrossDomain = (req: Request, res: Response, next: NextFunction) => {
  req
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
}

export class App{

  public server: express.Application;

  constructor(){
    this.server = express();
    this.middleware();
    this.router();
  }

  private middleware(){
    this.server.use(bodyParser.urlencoded({ extended: true }));
    this.server.use(bodyParser.json());
    this.server.use(express.json());
    this.server.use(allowCrossDomain);
  }

  private router(){
    this.server.use("/api", router);
  }
}