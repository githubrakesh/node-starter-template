import logger from "../../util/logger.util";
import {APP_IDENTIFIER} from "../../util/secrets.util";
import Sample, {ISample} from "../../models/sample.model";
import {BaseService} from "./base-mongoose.service";

class SampleService extends BaseService<ISample> {
  private constructor() {
    super();
    logger.silly(`[${APP_IDENTIFIER}] SampleService`);

    this.model = Sample;
  }

  static getInstance(): SampleService {
    return new SampleService();
  }
}

export const sampleService = SampleService.getInstance();
