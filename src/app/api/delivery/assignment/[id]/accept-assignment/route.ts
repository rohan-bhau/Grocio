import { auth } from "@/auth";
import connectDb from "@/lib/db";
import emitEventHandlers from "@/lib/emitEventHandlers";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDb();
    const { id } = await params;
    const session = await auth();
    const deliveryBoyId = session?.user?.id;

    if (!deliveryBoyId) {
      return NextResponse.json({ message: "unauthorized" }, { status: 400 });
    }

    const assignment = await DeliveryAssignment.findById(id);
    if (!assignment) {
      return NextResponse.json(
        { message: "assignment not found" },
        { status: 400 },
      );
    }

    if (assignment.status !== "broadcasted") {
      return NextResponse.json(
        { message: "assignment expired" },
        { status: 400 },
      );
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: deliveryBoyId,
      status: { $nin: ["broadcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return NextResponse.json(
        { message: "already assigned to other order" },
        { status: 400 },
      );
    }

    assignment.assignedTo = deliveryBoyId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order).populate("user");
    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 400 });
    }

    order.assignedDeliveryBoy = deliveryBoyId;
    await order.save();
    await order.populate("assignedDeliveryBoy");

    // Notify the user that a delivery boy has been assigned
    const orderOwner = order.user as any;
    if (orderOwner?.socketId) {
      await emitEventHandlers(
        "order-assigned",
        {
          orderId: order._id.toString(),
          assignedDeliveryBoy: order.assignedDeliveryBoy,
        },
        orderOwner.socketId,
      );
    }

    // Notify all admins that a delivery boy was assigned
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      if (admin.socketId) {
        await emitEventHandlers(
          "order-assigned",
          {
            orderId: order._id.toString(),
            assignedDeliveryBoy: order.assignedDeliveryBoy,
          },
          admin.socketId,
        );
      }
    }

    // Remove this delivery boy from other broadcasted assignments
    await DeliveryAssignment.updateMany(
      {
        _id: { $ne: assignment._id },
        broadcastedTo: deliveryBoyId,
        status: "broadcasted",
      },
      { $pull: { broadcastedTo: deliveryBoyId } },
    );

    return NextResponse.json(
      { message: "order accepted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `accept assignment error ${error}` },
      { status: 500 },
    );
  }
}
