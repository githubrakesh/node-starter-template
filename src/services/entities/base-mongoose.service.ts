import {Dictionary} from "express-serve-static-core";
import {Document, Model, ModelUpdateOptions} from "mongoose";

export abstract class BaseService<ModelInterface extends Document> {
  protected model: Model<ModelInterface>;

  async index(conditions: Dictionary<any>, projection: string = ''): Promise<unknown> {
    const params = [];
    params.push(conditions);
    if (projection) {
      params.push(projection);
    }
    return this.model.find(...params);
  }

  async findOne(conditions: Dictionary<any>, projection: string = ''): Promise<unknown> {
    const params = [];
    params.push(conditions);
    if (projection) {
      params.push(projection);
    }
    return this.model.findOne(...params);
  }

  async create(data: Dictionary<any>): Promise<unknown> {
    return this.model.create({...data});
  }

  async update(condition: Dictionary<any>, data: Dictionary<any>, multi: boolean = false): Promise<unknown> {
    const method = multi ? 'updateMany' : 'updateOne';
    return this.model[method](condition, data, { new: true });
  }

  async delete(condition: Dictionary<any>): Promise<void> {
    this.model.deleteMany(condition);
  }
}


