import ChatRoom from "@/models/chatRoom.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const { orderId, userId, deliveryBoyId } = await req.json()
        let room = await ChatRoom.findOne({ orderId })
        if (!room) {
            room = await ChatRoom.create({
                orderId, userId, deliveryBoyId
            })
        }
        return NextResponse.json(
            room, {status:200}
        )
    } catch (error) {
         return NextResponse.json({message: `create chat room error ${error}`}, { status: 200 });
    }
}