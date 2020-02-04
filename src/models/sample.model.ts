import mongoose, {Document, Schema} from "mongoose";

export interface ISample extends Document {
  name: string;
}

export const SampleSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String
  }
});

export default mongoose.model<ISample>("Sample", SampleSchema);
