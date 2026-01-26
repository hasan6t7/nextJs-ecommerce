import connectDB from "@/lib/mongoDB";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  return NextResponse.json({
    success: true,
    message: "connection success",
  });
}
