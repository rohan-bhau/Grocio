import { auth } from "@/auth";
import uploadOnCloudinary from "@/lib/cloudinary";
import connectDb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await auth();

    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Only admin can access this page" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const name = formData.get("name")?.toString() ?? "";
    const groceryId = formData.get("groceryId")?.toString() ?? "";
    const category = formData.get("category")?.toString() ?? "";
    const unit = formData.get("unit")?.toString() ?? "";
    const price = formData.get("price")?.toString() ?? "";
    const file = formData.get("image") as Blob | null;

    let imageUrl: string | null = null;
    if (file) {
      imageUrl = await uploadOnCloudinary(file);
    }

    const grocery = await Grocery.findByIdAndUpdate(groceryId,{
      name,
      category,
      unit,
      price,
      image: imageUrl ?? undefined,
    });

    return NextResponse.json(grocery, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `edit grocery error ${error}` },
      { status: 500 },
    );
  }
}
