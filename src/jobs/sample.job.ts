import logger from "../util/logger.util";
import {JobsAbstract} from "jobs-abstract-node";

class SampleJob extends JobsAbstract {
  async handle(): Promise<unknown> {
    logger.silly(`Called Job`);
    return undefined;
  }
}
export const sampleJob = new SampleJob();
