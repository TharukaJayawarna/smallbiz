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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

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

    const product = await Product.findOne({
      _id: id,
      businessId: user.businessId,
    }).populate("categoryId", "name");

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

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
      isActive,
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

    // Make sure category belongs to this business.
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

    const product = await Product.findOne({
      _id: id,
      businessId: user.businessId,
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    const slug = createSlug(name);

    const duplicate = await Product.findOne({
      _id: { $ne: id },
      businessId: user.businessId,
      slug,
    });

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message: "Another product with this name already exists",
        },
        { status: 409 }
      );
    }

    product.name = name.trim();
    product.slug = slug;
    product.description = description || "";
    product.price = Number(price);

    product.discountPrice =
      discountPrice !== undefined &&
      discountPrice !== ""
        ? Number(discountPrice)
        : undefined;

    product.stock = Number(stock || 0);

    product.sizes = Array.isArray(sizes)
      ? sizes
      : [];

    product.colors = Array.isArray(colors)
      ? colors
      : [];

    product.categoryId = categoryId || undefined;

    if (Array.isArray(images)) {
      product.images = images;
    }

    if (typeof isActive === "boolean") {
      product.isActive = isActive;
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

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

    const product = await Product.findOne({
      _id: id,
      businessId: user.businessId,
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    await Product.deleteOne({
      _id: id,
      businessId: user.businessId,
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
      },
      { status: 500 }
    );
  }
}