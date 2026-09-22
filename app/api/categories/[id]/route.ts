import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";

import User from "@/models/User";
import Category from "@/models/Category";

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
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

    const { name, description, isActive } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Category name is required",
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

    const category = await Category.findOne({
      _id: id,
      businessId: user.businessId,
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    const slug = createSlug(name);

    const duplicate = await Category.findOne({
      _id: { $ne: id },
      businessId: user.businessId,
      slug,
    });

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          message: "Another category with this name already exists",
        },
        { status: 409 }
      );
    }

    category.name = name.trim();
    category.slug = slug;
    category.description = description || "";

    if (typeof isActive === "boolean") {
      category.isActive = isActive;
    }

    await category.save();

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update category",
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

    const category = await Category.findOne({
      _id: id,
      businessId: user.businessId,
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 }
      );
    }

    await Category.deleteOne({
      _id: id,
      businessId: user.businessId,
    });

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete category",
      },
      { status: 500 }
    );
  }
}