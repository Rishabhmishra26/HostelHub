/**
 * Category.ts
 * --------------------------------------------------------------
 * Complaint categories as DATA (not just a hard-coded array) so
 * an admin can add/remove categories from the Admin Panel.
 * The static list in constants.ts is used as the seed/default.
 * --------------------------------------------------------------
 */
import mongoose, { Schema, models, model } from "mongoose";

export interface ICategory extends mongoose.Document {
  name: string;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default models.Category || model<ICategory>("Category", CategorySchema);
