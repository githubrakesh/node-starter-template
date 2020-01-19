import {schedule} from "node-cron";
import {Scheduler} from "./scheduler";

export abstract class BaseJob extends Scheduler {
  schedule(): BaseJob {
    const className = this.constructor.name.split("Job")[0];
    const file = require(`${__dirname}/${className}.job`);
    const key = Object.keys(file)[0];
    const job: BaseJob = file[key];
    schedule(this.cronExpression, job.handle);
    return this;
  }

  abstract async handle(): Promise<unknown>;
}
