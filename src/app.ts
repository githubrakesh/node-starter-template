import express from "express";
import compression from "compression";
import {apiRoutes} from "./routes/api.route";
import {APP_IDENTIFIER, ENV_ENVIRONMENT} from "./util/secrets.util";
import {ENVIRONMENT_PRODUCTION} from "./util/constants.util";
import * as _ from "lodash";
import {dbService} from "./services/db.service";
import bodyParser from "body-parser";
import errorHandler from "errorhandler";
import cors from "cors";
import logger from "./util/logger.util";
import {redisService} from "./services/redis.service";
import {jobManager} from "./jobs";

export class Application {
  private readonly APP: express.Application;
  private readonly PORT: number;

  private readonly ALLOWED_ORIGINS = [];

  constructor(port: number) {
    this.APP = express();
    this.PORT = port;

    this.setupCORS();
    this.initGlobalMiddleware();
    this.initServices();
    this.initRoutes();
    this.initJobs();
  }

  private setupCORS(): void {
    this.APP.use(cors({
      origin: (origin, callback) => {
        if (!origin || _.includes(this.ALLOWED_ORIGINS, origin)) {
          callback(undefined, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      exposedHeaders: ["Content-Disposition"]
    }));
    this.APP.set('views', `${__dirname}/./../src/views`);
    this.APP.use(require('serve-favicon')(`${__dirname}/./../src/public/images/favicon.ico`));

    this.APP.options("*");
  }

  private initGlobalMiddleware(): void {
    this.APP.use(bodyParser.json());
    this.APP.use(bodyParser.urlencoded({extended: true}));

    this.APP.use(compression());

    if (ENV_ENVIRONMENT !== ENVIRONMENT_PRODUCTION) {
      this.APP.use(errorHandler());
    }
  }

  private initServices(): void {
    // Entities

    // Services
    dbService;
    redisService;
  }

  private initRoutes(): void {
    this.APP.use(apiRoutes);
  }

  private initJobs(): void {
    jobManager.init();
  }

  start(): void {
    this.APP.listen(this.PORT, () => {
      logger.silly(`[${APP_IDENTIFIER}] App Started on PORT: ${this.PORT}`);
    });
  }
}
