import * as bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middlewares/error";
export class App {
  app: express.Application;

  constructor(
    private readonly controllers: unknown,
    private readonly port: number
  ) {
    this.app = express();
    this.initMiddlewares();
    this.initControllers(this.controllers);
  }

  private initMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.app.use(errorMiddleware);
  }

  private initControllers(controllers: any) {
    for (const controller of controllers) {
      this.app.use("/", controller.router);
    }
  }

  public async listen() {
    this.app.listen(this.port, async () => {
      console.log(`Server running on https://localhost:${this.port}`);
    });
  }
}
