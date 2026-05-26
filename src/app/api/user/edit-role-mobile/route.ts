import { auth } from "@/auth";
import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { role, mobile } = await req.json();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized: no session found" },
        { status: 401 },
      );
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { role, mobile },
      { new: true },
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    return NextResponse.json({ status: 200, user });
  } catch (error) {
    console.error("edit-role-mobile error", error);
    return NextResponse.json(
      { message: `edit user and mobile error ${error}` },
      { status: 500 },
    );
  }
}
