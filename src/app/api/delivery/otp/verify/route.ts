import connectDb from "@/lib/db";
import emitEventHandlers from "@/lib/emitEventHandlers";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model"; // ✅ add
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const { orderId, otp } = await req.json();
    if (!orderId || !otp) {
      return NextResponse.json(
        { message: "orderId or otp not found" },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 400 });
    }

    if (order.deliveryOtp !== otp) {
      return NextResponse.json(
        { message: "Incorrect or invalid otp" },
        { status: 400 },
      );
    }

    order.status = "delivered";
    order.deliveryOtpVerification = true;
    order.deliveredAt = new Date();
    await order.save();

    const orderOwner = order.user as any;
    const userSocketId = orderOwner?.socketId;

    await emitEventHandlers(
      "order-status-update",
      { orderId: order._id.toString(), status: order.status },
      userSocketId,
    );

    const admin = await User.findOne({ role: "admin" }).select("socketId");
    if (admin?.socketId) {
      await emitEventHandlers(
        "order-status-update",
        { orderId: order._id.toString(), status: order.status },
        admin.socketId,
      );
    }

    await DeliveryAssignment.updateOne(
      { order: orderId },
      { $set: { assignedTo: null, status: "completed" } },
    );

    return NextResponse.json(
      { message: "Delivery successfully completed" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `delivery verification error ${error}` },
      { status: 500 },
    );
  }
}
