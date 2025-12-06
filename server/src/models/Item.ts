import mongoose, { Schema } from 'mongoose';

export interface IItem {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  hasIssue: boolean;
}

const itemSchema = new Schema<IItem>({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  fill: { type: String, required: true },
  hasIssue: { type: Boolean, default: false }
}, { _id: false });

export const Item = itemSchema;

