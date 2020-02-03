import logger from "../../util/logger.util";
import {APP_IDENTIFIER} from "../../util/secrets.util";
import multer from "multer";

class FileUploadFactory {
    private static _instance: any;

    static getInstance(): any {
        logger.silly(`[${APP_IDENTIFIER}] FileUploadFactory getInstance()`);

        return this._instance || (this._instance = multer({storage: multer.memoryStorage()}));
    }
}

export const fileUpload = FileUploadFactory.getInstance();