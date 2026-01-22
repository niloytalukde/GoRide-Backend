import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  phone_number: string;
  email?: string;
  name?: string;
  isVerified: boolean;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
