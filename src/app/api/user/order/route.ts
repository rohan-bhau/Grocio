import connectDb from "@/lib/db";
import emitEventHandlers from "@/lib/emitEventHandlers";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();

    if (!userId || !items || !paymentMethod || !totalAmount || !address) {
      return NextResponse.json(
        { message: "Please send all credentials" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 400 });
    }

    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    // Notify all admins about the new order in realtime
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      if (admin.socketId) {
        await emitEventHandlers("new-order", newOrder, admin.socketId);
      }
    }

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: `place order error ${error}` },
      { status: 500 },
    );
  }
}
