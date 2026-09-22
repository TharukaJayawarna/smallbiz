import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";

import User from "@/models/User";
import Product from "@/models/Product";
import Category from "@/models/Category";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user || !user.businessId) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found",
        },
        { status: 404 }
      );
    }

    const products = await Product.find({
      businessId: user.businessId,
    })
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      sizes,
      colors,
      categoryId,
      images,
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name and price are required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user || !user.businessId) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found",
        },
        { status: 404 }
      );
    }

    // Verify that the selected category belongs
    // to the logged-in user's business.
    if (categoryId) {
      const category = await Category.findOne({
        _id: categoryId,
        businessId: user.businessId,
      });

      if (!category) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid category",
          },
          { status: 400 }
        );
      }
    }

    const slug = createSlug(name);

    const existingProduct = await Product.findOne({
      businessId: user.businessId,
      slug,
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "A product with this name already exists",
        },
        { status: 409 }
      );
    }

    const product = await Product.create({
      businessId: user.businessId,
      categoryId: categoryId || undefined,
      name: name.trim(),
      slug,
      description: description || "",
      price: Number(price),
      discountPrice:
        discountPrice !== undefined &&
        discountPrice !== ""
          ? Number(discountPrice)
          : undefined,
      stock: Number(stock || 0),
      sizes: Array.isArray(sizes) ? sizes : [],
      colors: Array.isArray(colors) ? colors : [],
      images: Array.isArray(images) ? images : [],
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
      },
      { status: 500 }
    );
  }
}