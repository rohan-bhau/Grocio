import connectDb from "@/lib/db";
import emitEventHandlers from "@/lib/emitEventHandlers";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, otp } = await req.json();

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 400 });
    }

    if (order.deliveryOtp !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    order.deliveryOtpVerification = true;
    order.status = "delivered";
    order.deliveredAt = new Date();
    order.deliveryOtp = null;
    await order.save();

    await DeliveryAssignment.findOneAndUpdate(
      { order: order._id },
      { status: "completed" },
    );

    const orderOwner = order.user as any;
    const userSocketId = orderOwner?.socketId;

    if (userSocketId) {
      await emitEventHandlers(
        "order-status-update",
        {
          orderId: order._id.toString(),
          status: "delivered",
        },
        userSocketId,
      );
    }

    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      if (admin.socketId) {
        await emitEventHandlers(
          "order-status-update",
          {
            orderId: order._id.toString(),
            status: "delivered",
          },
          admin.socketId,
        );
      }
    }

    return NextResponse.json(
      { message: "OTP verified, order delivered successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `verify otp error ${error}` },
      { status: 500 },
    );
  }
}
