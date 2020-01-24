import {schedule} from "node-cron";
import {Scheduler} from "./scheduler";
import fs from "fs";

export abstract class BaseJob extends Scheduler {
  schedule(): BaseJob {
    const job: BaseJob = this.getJob();
    schedule(this.cronExpression, job.handle);
    return this;
  }

  abstract async handle(): Promise<unknown>;

  private getJob(): BaseJob {
    const fileName = fs.readdirSync(__dirname).find(file => {
      return this.constructor.name.toLowerCase().includes(
        file.toLowerCase().split(".")[0]
      );
    });
    const file = require(`${__dirname}/${fileName}`);
    const key = Object.keys(file)[0];
    return file[key];
  }
}
