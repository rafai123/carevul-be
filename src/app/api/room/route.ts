import { PrismaClient, Room } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(request: Request) {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const userType = url.searchParams.get("userType");
  
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" });
    }
  
    let userRooms: Room[] = [];
  
    if (userType === "DOCTOR") {
      userRooms = await prisma.room.findMany({
        where: {
          doctorId: userId,
        },
      });
    } else {
      userRooms = await prisma.room.findMany({
        where: {
          userId: userId,
        },
      });
    }
  
    return new Response(JSON.stringify(userRooms), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
}

export async function POST(request: Request) {
    const res = await request.json();
  
    if (!res.userId || !res.doctorId) {
      return NextResponse.json({ error: "Missing userId or doctorId" });
    }
  
    const newRoom = await prisma.room.create({
      data: {
        userId: String(res.userId),
        doctorId: String(res.doctorId),
      },
    });
  
    return new Response(JSON.stringify(newRoom), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }