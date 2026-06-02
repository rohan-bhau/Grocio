import connectDb from "@/lib/db";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    // Validate totalAmount is a number
    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      return NextResponse.json(
        { message: "Invalid total amount" },
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

    // Convert to smallest currency unit (paisa for BDT)
    const amountInPaisa = Math.round(totalAmount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/user/order-success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/user/order-cancel`,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: "Grocio Order Payment",
              description: `Order #${newOrder._id}`,
            },
            unit_amount: amountInPaisa,
          },
          quantity: 1,
        },
      ],
      metadata: { orderId: newOrder._id.toString() },
    });

    return NextResponse.json(
      { url: session.url, orderId: newOrder._id },
      { status: 200 },
    );
  } catch (error) {
    console.error("Payment error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { message: `Payment error: ${errorMessage}` },
      { status: 500 },
    );
  }
}
