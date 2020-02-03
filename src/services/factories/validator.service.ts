import {ValidatorService} from "request-validator-node";
import logger from "../../util/logger.util";
import {APP_IDENTIFIER} from "../../util/secrets.util";

class ValidatorFactory {
  private static _instance: ValidatorService;

  static getInstance(): ValidatorService {
    logger.silly(`[${APP_IDENTIFIER}] ValidatorFactory getInstance()`);

    return this._instance || (this._instance = ValidatorService.init({schemaFolder: "schema"}));
  }
}

export const validatorService = ValidatorFactory.getInstance();
