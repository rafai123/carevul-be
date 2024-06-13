import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()

export async function GET(request: Request) {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");
  
    if (!roomId) {
      return NextResponse.json({ error: "Missing room id" });
    }
  
    const roomWithChats = await prisma.room.findUnique({
      where: {
        id: String(roomId),
      },
      include: {
        chats: true,
      },
    });
  
    return new Response(JSON.stringify(roomWithChats), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
}

export async function POST(request: Request) {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");
  
    const res = await request.json();
  
    if (!roomId) {
      return NextResponse.json({ error: "Missing room id" });
    }
  
    if (!res.userId || !res.message) {
      return NextResponse.json({ error: "Missing userId or message" });
    }
  
    const newChat = await prisma.chat.create({
      data: {
        roomId: String(roomId),
        userId: String(res.userId),
        message: String(res.message),
      },
    });
  
    return new Response(JSON.stringify(newChat), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }