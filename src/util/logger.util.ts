import * as winston from "winston";
import appRoot from "app-root-path";
import {ENV_ENVIRONMENT} from "./secrets.util";

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      format: winston.format.json(),
      level: "info",
      filename: `${appRoot}/logs/info.log`,
    }),
    new winston.transports.File({
      format: winston.format.json(),
      level: "error",
      filename: `${appRoot}/logs/error.log`,
    })
  ]
});

if (ENV_ENVIRONMENT !== "production") {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
    level: "silly"
  }));
}

// https://github.com/winstonjs/winston/issues/1427
export default logger;
