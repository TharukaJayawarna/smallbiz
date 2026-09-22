import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "OWNER" | "ADMIN";
  businessId?: mongoose.Types.ObjectId;

  // Password reset fields
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["OWNER", "ADMIN"],
      default: "OWNER",
    },

    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
    },

    // Password reset token
    resetPasswordToken: {
      type: String,
      default: null,
    },

    // Password reset token expiry
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;