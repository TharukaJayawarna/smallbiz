import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IBusiness extends Document {
  name: string;
  slug: string;
  description?: string;

  whatsappNumber: string;
  phoneNumber?: string;
  address?: string;

  logo?: string;
  coverImage?: string;

  theme: {
    primaryColor: string;
    secondaryColor: string;
    buttonColor: string;
    layout: "GRID" | "LIST";
    showCategories: boolean;
    showFeaturedProducts: boolean;
  };

  ownerId: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    theme: {
      primaryColor: {
        type: String,
        default: "#111827",
      },

      secondaryColor: {
        type: String,
        default: "#6B7280",
      },

      buttonColor: {
        type: String,
        default: "#111827",
      },

      layout: {
        type: String,
        enum: ["GRID", "LIST"],
        default: "GRID",
      },

      showCategories: {
        type: Boolean,
        default: true,
      },

      showFeaturedProducts: {
        type: Boolean,
        default: true,
      },
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

const Business: Model<IBusiness> =
  mongoose.models.Business ||
  mongoose.model<IBusiness>(
    "Business",
    BusinessSchema
  );

export default Business;