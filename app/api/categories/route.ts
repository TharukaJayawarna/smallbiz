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

    const categories = await Category.find({
      businessId: user.businessId,
    }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
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

    const { name, description } = body;

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

    const slug = createSlug(name);

    const existingCategory = await Category.findOne({
      businessId: user.businessId,
      slug,
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "A category with this name already exists",
        },
        { status: 409 }
      );
    }

    const category = await Category.create({
      businessId: user.businessId,
      name: name.trim(),
      slug,
      description: description || "",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create category error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create category",
      },
      { status: 500 }
    );
  }
}