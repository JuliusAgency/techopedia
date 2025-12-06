import mongoose, { Schema, Model } from 'mongoose';
import { IItem, Item } from './Item.js';

export interface IDesign {
  filename: string;
  status: 'pending' | 'processed' | 'error';
  svgWidth: number;
  svgHeight: number;
  itemsCount: number;
  coverageRatio: number;
  createdAt: Date;
  items: IItem[];
  issues: string[];
}

const designSchema = new Schema<IDesign>({
  filename: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processed', 'error'], 
    default: 'pending' 
  },
  svgWidth: { type: Number, default: 0 },
  svgHeight: { type: Number, default: 0 },
  itemsCount: { type: Number, default: 0 },
  coverageRatio: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  items: [Item],
  issues: [String]
});

export const Design: Model<IDesign> = mongoose.model<IDesign>('Design', designSchema);

