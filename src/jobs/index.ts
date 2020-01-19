import logger from "../util/logger.util";
import {APP_IDENTIFIER} from "../util/secrets.util";
import {sampleJob} from "./sample.job";

class JobManager {
  private constructor() {
    logger.silly(`[${APP_IDENTIFIER}] JobManager`);
  }

  static getInstance(): JobManager {
    return new JobManager();
  }

  public init(): void {
    sampleJob.everyMinute().schedule();
  }
}

export const jobManager = JobManager.getInstance();
