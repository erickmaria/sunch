import express from "express";
import { router } from "./router/router";
import bodyParser from 'body-parser';''

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
  }

  private router(){
    this.server.use("/api", router);
  }
}