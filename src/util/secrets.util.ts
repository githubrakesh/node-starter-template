import dotenv from "dotenv";
import {FILEPATH_ENV} from "./constants.util";

dotenv.config({path: FILEPATH_ENV});

export const ENV_ENVIRONMENT = process.env.NODE_ENV;

export const APP_IDENTIFIER = process.env.APP_IDENTIFIER;
export const ENV_APP_PORT_REST = +(process.env.APP_PORT_REST || 3000);

export const REDIS_PORT = +(process.env.REDIS_PORT || 3000);
