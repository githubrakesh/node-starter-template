import logger from "../../util/logger.util";
import {APP_IDENTIFIER} from "../../util/secrets.util";
import Sample, {ISample} from "../../models/sample.model";
import {Dictionary} from "express-serve-static-core";

class SampleService {
  private constructor() {
    logger.silly(`[${APP_IDENTIFIER}] SampleService`);
  }

  static getInstance(): SampleService {
    return new SampleService();
  }

  async index(): Promise<ISample[]> {
    return Sample.find({});
  }

  async showById(id: number): Promise<ISample> {
    return Sample.findById(id);
  }

  async create(data: Dictionary<any>): Promise<ISample> {
    return Sample.create({...data});
  }

  async update(data: Dictionary<any>, id: string): Promise<ISample> {
    return Sample.updateOne({_id: id}, {$set: {...data}});
  }

  async destroy(id: string) {
    await Sample.deleteOne({_id: id});

    return;
  }
}

export const sampleService = SampleService.getInstance();
