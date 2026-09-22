import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import Business from "@/models/Business";
import Product from "@/models/Product";
import Order from "@/models/Order";

import {
  generatePayHereHash,
  getPayHereConfig,
} from "@/lib/payhere";

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(100 + Math.random() * 900);

  return `ORD-${timestamp}-${random}`;
}

interface CheckoutItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CheckoutRequest {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  deliveryAddress: string;
  customerNote?: string;

  paymentMethod: "COD" | "PAYHERE";

  items: CheckoutItem[];
}

function splitCustomerName(name: string) {
  const parts = name.trim().split(/\s+/);

  const firstName = parts.shift() || "Customer";
  const lastName = parts.join(" ") || firstName;

  return {
    firstName,
    lastName,
  };
}

function createWhatsAppUrl(
  business: any,
  order: any
): string {
  let whatsappMessage = `New Order - ${business.name}\n\n`;

  whatsappMessage += `Order Number: ${order.orderNumber}\n\n`;

  whatsappMessage += `Customer:\n${order.customerName}\n\n`;

  whatsappMessage += `Phone:\n${order.customerPhone}\n\n`;

  whatsappMessage += `Email:\n${order.customerEmail}\n\n`;

  whatsappMessage += `City:\n${order.city}\n\n`;

  whatsappMessage += `Delivery Address:\n${order.deliveryAddress}\n\n`;

  whatsappMessage += `Payment Method:\n${
    order.paymentMethod === "PAYHERE"
      ? "PayHere - Online Payment"
      : "Cash on Delivery"
  }\n\n`;

  whatsappMessage += `Payment Status:\n${
    order.paymentStatus === "PAID"
      ? "PAID"
      : "PENDING"
  }\n\n`;

  whatsappMessage += `Items:\n`;

  for (const item of order.items) {
    whatsappMessage += `\n${item.name}`;
    whatsappMessage += `\nQty: ${item.quantity}`;
    whatsappMessage += `\nPrice: Rs. ${item.price.toLocaleString()}`;

    if (item.size) {
      whatsappMessage += `\nSize: ${item.size}`;
    }

    if (item.color) {
      whatsappMessage += `\nColor: ${item.color}`;
    }

    whatsappMessage += `\n`;
  }

  whatsappMessage += `\nSubtotal: Rs. ${order.subtotal.toLocaleString()}`;

  whatsappMessage += `\nDelivery: Rs. ${order.deliveryFee.toLocaleString()}`;

  whatsappMessage += `\nTotal: Rs. ${order.total.toLocaleString()}`;

  if (order.customerNote) {
    whatsappMessage += `\n\nCustomer Note:\n${order.customerNote}`;
  }

  let whatsappNumber = String(
    business.whatsappNumber || ""
  ).replace(/\D/g, "");

  if (whatsappNumber.startsWith("0")) {
    whatsappNumber =
      "94" + whatsappNumber.substring(1);
  }

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await mongoose.startSession();

  try {
    const { slug } = await params;

    const body: CheckoutRequest = await request.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      city,
      deliveryAddress,
      customerNote,
      paymentMethod,
      items,
    } = body;

    if (
      !customerName?.trim() ||
      !customerPhone?.trim() ||
      !customerEmail?.trim() ||
      !city?.trim() ||
      !deliveryAddress?.trim() ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Customer details and cart items are required",
        },
        { status: 400 }
      );
    }

    if (
      paymentMethod !== "COD" &&
      paymentMethod !== "PAYHERE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment method",
        },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(customerEmail.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
        },
        { status: 400 }
      );
    }

    await connectDB();

    let createdOrder: any = null;
    let businessData: any = null;

    await session.withTransaction(async () => {
      const business = await Business.findOne({
        slug,
      }).session(session);

      if (!business) {
        throw new Error("STORE_NOT_FOUND");
      }

      businessData = business;

      /*
       * Combine quantities for stock validation.
       */
      const quantityByProduct =
        new Map<string, number>();

      for (const item of items) {
        if (
          !item.productId ||
          !mongoose.Types.ObjectId.isValid(
            item.productId
          ) ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1
        ) {
          throw new Error("INVALID_CART_ITEM");
        }

        const currentQuantity =
          quantityByProduct.get(item.productId) || 0;

        quantityByProduct.set(
          item.productId,
          currentQuantity + item.quantity
        );
      }

      const orderItems = [];

      /*
       * Get trusted product information
       * from MongoDB.
       */
      for (const item of items) {
        const product = await Product.findOne({
          _id: item.productId,
          businessId: business._id,
          isActive: true,
        }).session(session);

        if (!product) {
          throw new Error("PRODUCT_NOT_AVAILABLE");
        }

        if (
          item.size &&
          product.sizes.length > 0 &&
          !product.sizes.includes(item.size)
        ) {
          throw new Error(
            `INVALID_SIZE:${product.name}`
          );
        }

        if (
          item.color &&
          product.colors.length > 0 &&
          !product.colors.includes(item.color)
        ) {
          throw new Error(
            `INVALID_COLOR:${product.name}`
          );
        }

        const actualPrice =
          product.discountPrice !== undefined &&
          product.discountPrice !== null
            ? product.discountPrice
            : product.price;

        orderItems.push({
          productId: product._id,
          name: product.name,
          price: actualPrice,
          quantity: item.quantity,
          size: item.size || "",
          color: item.color || "",
          image: product.images[0] || "",
        });
      }

      /*
       * Reserve stock immediately.
       *
       * For PayHere:
       * - successful payment keeps stock reduced
       * - failed/cancelled payment restores stock
       *
       * For COD:
       * - stock remains reduced immediately
       */
      for (const [
        productId,
        quantity,
      ] of quantityByProduct) {
        const updatedProduct =
          await Product.findOneAndUpdate(
            {
              _id: productId,
              businessId: business._id,
              isActive: true,
              stock: { $gte: quantity },
            },
            {
              $inc: {
                stock: -quantity,
              },
            },
            {
              returnDocument: "after",
              session,
            }
          );

        if (!updatedProduct) {
          const product = await Product.findOne({
            _id: productId,
            businessId: business._id,
          }).session(session);

          if (!product) {
            throw new Error("PRODUCT_NOT_FOUND");
          }

          throw new Error(
            `INSUFFICIENT_STOCK:${product.name}:${product.stock}`
          );
        }
      }

      const subtotal = orderItems.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      );

      const deliveryFee = 0;

      const total = subtotal + deliveryFee;

      const orders = await Order.create(
        [
          {
            businessId: business._id,

            orderNumber: generateOrderNumber(),

            customerName:
              customerName.trim(),

            customerPhone:
              customerPhone.trim(),

            customerEmail:
              customerEmail.trim().toLowerCase(),

            city: city.trim(),

            deliveryAddress:
              deliveryAddress.trim(),

            customerNote:
              customerNote?.trim() || "",

            items: orderItems,

            subtotal,
            deliveryFee,
            total,

            status: "PENDING",

            paymentMethod,

            paymentStatus: "PENDING",

            paymentId: "",
          },
        ],
        { session }
      );

      createdOrder = orders[0];
    });

    if (!createdOrder) {
      throw new Error("ORDER_CREATION_FAILED");
    }

    /*
     * COD
     *
     * Create WhatsApp URL immediately.
     */
    if (paymentMethod === "COD") {
      const whatsappUrl =
        createWhatsAppUrl(
          businessData,
          createdOrder
        );

      return NextResponse.json(
        {
          success: true,

          message:
            "Order created successfully",

          paymentMethod: "COD",

          order: {
            id: createdOrder._id,
            orderNumber:
              createdOrder.orderNumber,
            total: createdOrder.total,
          },

          whatsappUrl,
        },
        { status: 201 }
      );
    }

    /*
     * PAYHERE
     */
    const {
      merchantId,
      merchantSecret,
      checkoutUrl,
      appUrl,
    } = getPayHereConfig();

    const orderNumber =
      createdOrder.orderNumber;

    const amount = Number(
      createdOrder.total
    ).toFixed(2);

    const currency = "LKR";

    const hash = generatePayHereHash(
      merchantId,
      orderNumber,
      createdOrder.total,
      currency,
      merchantSecret
    );

    const {
      firstName,
      lastName,
    } = splitCustomerName(
      customerName.trim()
    );

    const paymentData = {
      merchant_id: merchantId,

      return_url:
        `${appUrl}/shop/${encodeURIComponent(
          slug
        )}/payment/success?orderId=${encodeURIComponent(
          orderNumber
        )}`,

      cancel_url:
        `${appUrl}/shop/${encodeURIComponent(
          slug
        )}/payment/cancel?orderId=${encodeURIComponent(
          orderNumber
        )}`,

      notify_url:
        `${appUrl}/api/payments/payhere/notify`,

      first_name: firstName,

      last_name: lastName,

      email:
        customerEmail.trim(),

      phone:
        customerPhone.trim(),

      address:
        deliveryAddress.trim(),

      city:
        city.trim(),

      country: "Sri Lanka",

      order_id: orderNumber,

      items: orderItemsToString(
        createdOrder.items
      ),

      currency,

      amount,

      hash,
    };

    return NextResponse.json(
      {
        success: true,

        message:
          "Order created. Redirecting to PayHere.",

        paymentMethod: "PAYHERE",

        order: {
          id: createdOrder._id,
          orderNumber:
            createdOrder.orderNumber,
          total: createdOrder.total,
        },

        payment: {
          action: checkoutUrl,
          fields: paymentData,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Checkout error:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "";

    if (
      message ===
      "STORE_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Store not found",
        },
        { status: 404 }
      );
    }

    if (
      message ===
      "INVALID_CART_ITEM"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid cart item",
        },
        { status: 400 }
      );
    }

    if (
      message ===
      "PRODUCT_NOT_AVAILABLE"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One of the products is no longer available",
        },
        { status: 400 }
      );
    }

    if (
      message ===
      "PRODUCT_NOT_FOUND"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "One of the products could not be found",
        },
        { status: 400 }
      );
    }

    if (
      message.startsWith(
        "INSUFFICIENT_STOCK:"
      )
    ) {
      const [
        ,
        productName,
        stock,
      ] = message.split(":");

      return NextResponse.json(
        {
          success: false,
          message: `${productName} only has ${stock} item(s) left in stock.`,
        },
        { status: 400 }
      );
    }

    if (
      message.startsWith(
        "INVALID_SIZE:"
      )
    ) {
      const productName =
        message.replace(
          "INVALID_SIZE:",
          ""
        );

      return NextResponse.json(
        {
          success: false,
          message: `Invalid size selected for ${productName}`,
        },
        { status: 400 }
      );
    }

    if (
      message.startsWith(
        "INVALID_COLOR:"
      )
    ) {
      const productName =
        message.replace(
          "INVALID_COLOR:",
          ""
        );

      return NextResponse.json(
        {
          success: false,
          message: `Invalid color selected for ${productName}`,
        },
        { status: 400 }
      );
    }

    if (
      message ===
      "ORDER_CREATION_FAILED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to create order",
        },
        { status: 500 }
      );
    }

    if (
      message.includes(
        "PAYHERE"
      ) ||
      message.includes(
        "PAYHERE_MERCHANT"
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PayHere configuration is missing or invalid",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create order",
      },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
}

function orderItemsToString(
  items: any[]
): string {
  return items
    .map(
      (item) =>
        `${item.name} x ${item.quantity}`
    )
    .join(", ")
    .slice(0, 255);
}