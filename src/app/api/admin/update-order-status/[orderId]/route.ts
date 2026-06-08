import connectDb from "@/lib/db";
import emitEventHandlers from "@/lib/emitEventHandlers";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

async function handleUpdateStatus(
  req: NextRequest,
  { params }: { params: { orderId: string } },
) {
  try {
    await connectDb();
    const { orderId } = await params;
    const { status } = await req.json();
    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 400 });
    }

    order.status = status;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let deliveryBoysPayload: any = [];

    if (status === "out of delivery" && !order.assignment) {
      const { latitude, longitude } = order.address;

      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 10000,
          },
        },
      });

      const nearByIds = nearByDeliveryBoys.map((b) => b._id);

      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((b) => String(b)));

      const availableDeliveryBoys = nearByDeliveryBoys.filter(
        (b) => !busyIdSet.has(String(b._id)),
      );

      const candidates = availableDeliveryBoys.map((b) => b._id);

      if (candidates.length === 0) {
        await order.save();

        const orderOwner = order.user as any;
        const userSocketId = orderOwner?.socketId;

        await emitEventHandlers(
          "order-status-update",
          { orderId: order._id.toString(), status: order.status },
          userSocketId,
        );

        return NextResponse.json(
          { message: "Delivery boy not found" },
          { status: 200 },
        );
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      });

      await deliveryAssignment.populate("order");

      for (const boyId of candidates) {
        const boy = await User.findById(boyId);
        if (boy?.socketId) {
          await emitEventHandlers(
            "new-assignment",
            deliveryAssignment,
            boy.socketId,
          );
        }
      }

      order.assignment = deliveryAssignment._id;
      deliveryBoysPayload = availableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location?.coordinates[1],
        longitude: b.location?.coordinates[0],
      }));
    }

    await order.save();
    await order.populate("user");

    const orderOwner = order.user as any;
    const userSocketId = orderOwner?.socketId;

    await emitEventHandlers(
      "order-status-update",
      { orderId: order._id.toString(), status: order.status },
      userSocketId,
    );

    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      if (admin.socketId && admin.socketId !== userSocketId) {
        await emitEventHandlers(
          "order-status-update",
          { orderId: order._id.toString(), status: order.status },
          admin.socketId,
        );
      }
    }

    return NextResponse.json(
      {
        assignment: order.assignment?._id,
        availableBoys: deliveryBoysPayload,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `update status error ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { orderId: string } },
) {
  return handleUpdateStatus(req, context);
}

export async function PATCH(
  req: NextRequest,
  context: { params: { orderId: string } },
) {
  return handleUpdateStatus(req, context);
}
