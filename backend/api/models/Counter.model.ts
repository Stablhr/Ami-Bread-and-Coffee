import mongoose, {Schema} from 'mongoose';

/** Simple named counters, e.g. for order numbers (AMI-1001, AMI-1002, …). */
export interface CounterDocument {
  _id: string;
  seq: number;
}

const CounterSchema = new Schema<CounterDocument>({
  _id: {type: String, required: true},
  seq: {type: Number, default: 0}
});

export const CounterModel = mongoose.model<CounterDocument>('Counter', CounterSchema, 'counters');
