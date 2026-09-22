import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getCurrentUserId } from "@/lib/auth";
import Business from "@/models/Business";

const DEFAULT_THEME = {
  primaryColor: "#111827",
  secondaryColor: "#6B7280",
  buttonColor: "#111827",
  layout: "GRID" as const,
  showCategories: true,
  showFeaturedProducts: true,
};

const isValidHexColor = (color: string) => {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
};

/**
 * GET BUSINESS SETTINGS
 */
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const user = await mongoose
      .model("User")
      .findById(userObjectId)
      .select("businessId");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.businessId) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found for this user",
        },
        { status: 404 }
      );
    }

    const business = await Business.findOne({
      _id: user.businessId,
      ownerId: userObjectId,
    });

    if (!business) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found",
        },
        { status: 404 }
      );
    }

    /*
     * Initialize theme for older businesses
     */
    if (!business.theme) {
      business.theme = DEFAULT_THEME;
      await business.save();
    }

    return NextResponse.json({
      success: true,
      business,
    });
  } catch (error) {
    console.error("Get business error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to get business settings",
      },
      { status: 500 }
    );
  }
}

/**
 * UPDATE BUSINESS SETTINGS
 */
export async function PUT(request: NextRequest) {
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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user ID",
        },
        { status: 400 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const user = await mongoose
      .model("User")
      .findById(userObjectId)
      .select("businessId");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.businessId) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found for this user",
        },
        { status: 404 }
      );
    }

    const business = await Business.findOne({
      _id: user.businessId,
      ownerId: userObjectId,
    });

    if (!business) {
      return NextResponse.json(
        {
          success: false,
          message: "Business not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    /*
     * ----------------------------------------------------
     * BUSINESS INFORMATION
     * ----------------------------------------------------
     */

    if (body.name !== undefined) {
      if (
        typeof body.name !== "string" ||
        body.name.trim().length === 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Business name is required",
          },
          { status: 400 }
        );
      }

      business.name = body.name.trim();
    }

    if (body.description !== undefined) {
      business.description =
        typeof body.description === "string"
          ? body.description.trim()
          : "";
    }

    if (body.whatsappNumber !== undefined) {
      business.whatsappNumber =
        typeof body.whatsappNumber === "string"
          ? body.whatsappNumber.trim()
          : "";
    }

    if (body.phoneNumber !== undefined) {
      business.phoneNumber =
        typeof body.phoneNumber === "string"
          ? body.phoneNumber.trim()
          : "";
    }

    if (body.address !== undefined) {
      business.address =
        typeof body.address === "string"
          ? body.address.trim()
          : "";
    }

    if (body.logo !== undefined) {
      business.logo =
        typeof body.logo === "string"
          ? body.logo.trim()
          : "";
    }

    if (body.coverImage !== undefined) {
      business.coverImage =
        typeof body.coverImage === "string"
          ? body.coverImage.trim()
          : "";
    }

    /*
     * ----------------------------------------------------
     * THEME
     * ----------------------------------------------------
     */

    if (body.theme !== undefined) {
      if (
        typeof body.theme !== "object" ||
        body.theme === null ||
        Array.isArray(body.theme)
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid theme data",
          },
          { status: 400 }
        );
      }

      const currentTheme = business.theme || DEFAULT_THEME;

      const newTheme = {
        ...currentTheme,
        ...body.theme,
      };

      /*
       * Validate primary color
       */
      if (
        typeof newTheme.primaryColor !== "string" ||
        !isValidHexColor(newTheme.primaryColor)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid primary color. Use format #RRGGBB.",
          },
          { status: 400 }
        );
      }

      /*
       * Validate secondary color
       */
      if (
        typeof newTheme.secondaryColor !== "string" ||
        !isValidHexColor(newTheme.secondaryColor)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid secondary color. Use format #RRGGBB.",
          },
          { status: 400 }
        );
      }

      /*
       * Validate button color
       */
      if (
        typeof newTheme.buttonColor !== "string" ||
        !isValidHexColor(newTheme.buttonColor)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid button color. Use format #RRGGBB.",
          },
          { status: 400 }
        );
      }

      /*
       * Validate layout
       */
      if (
        newTheme.layout !== "GRID" &&
        newTheme.layout !== "LIST"
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Layout must be GRID or LIST.",
          },
          { status: 400 }
        );
      }

      /*
       * Validate showCategories
       */
      if (typeof newTheme.showCategories !== "boolean") {
        return NextResponse.json(
          {
            success: false,
            message: "showCategories must be a boolean.",
          },
          { status: 400 }
        );
      }

      /*
       * Validate showFeaturedProducts
       */
      if (
        typeof newTheme.showFeaturedProducts !== "boolean"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "showFeaturedProducts must be a boolean.",
          },
          { status: 400 }
        );
      }

      business.theme = {
        primaryColor: newTheme.primaryColor,
        secondaryColor: newTheme.secondaryColor,
        buttonColor: newTheme.buttonColor,
        layout: newTheme.layout,
        showCategories: newTheme.showCategories,
        showFeaturedProducts:
          newTheme.showFeaturedProducts,
      };
    }

    /*
     * ----------------------------------------------------
     * SAVE
     * ----------------------------------------------------
     */

    await business.save();

    return NextResponse.json({
      success: true,
      message: "Business settings updated successfully",
      business,
    });
  } catch (error) {
    console.error("Update business error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update business settings",
      },
      { status: 500 }
    );
  }
}

