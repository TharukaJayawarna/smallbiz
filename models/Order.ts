import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface IOrder extends Document {
  businessId: mongoose.Types.ObjectId;

  orderNumber: string;

  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  deliveryAddress: string;
  customerNote?: string;

  items: IOrderItem[];

  subtotal: number;
  deliveryFee: number;
  total: number;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

  paymentMethod: "COD" | "PAYHERE";

  paymentStatus: "PENDING" | "PAID" | "FAILED";

  paymentId?: string;

  paidAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    size: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    customerNote: {
      type: String,
      default: "",
      trim: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,

      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,

      enum: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],

      default: "PENDING",
    },

    paymentMethod: {
      type: String,

      enum: ["COD", "PAYHERE"],

      default: "COD",
    },

    paymentStatus: {
      type: String,

      enum: ["PENDING", "PAID", "FAILED"],

      default: "PENDING",
    },

    paymentId: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({
  businessId: 1,
  createdAt: -1,
});

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;