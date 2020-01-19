import {BaseJob} from "./base.job";
import logger from "../util/logger.util";

class SampleJob extends BaseJob {
  async handle(): Promise<unknown> {
    logger.silly(`Called Job`);
    return undefined;
  }
}
export const sampleJob = new SampleJob();
