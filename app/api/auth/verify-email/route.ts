import connectDB from "@/lib/mongoDB";
import { catchError, response } from "@/lib/response";
import UserModel from "@/Models/users.model";
import { jwtVerify } from "jose";

export async function POST(request) {
  try {
    await connectDB();
    const rawBody = await request.text();
    console.log("RAW   BODY",rawBody)

    let token: string;

    try {
      const body = JSON.parse(rawBody);
      token = body.token;
    } catch {
      token = rawBody;
    }

    if (!token) {
      return response(false, 400, "Missing token");
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    let decoded;
    try {
      decoded = await jwtVerify(token, secret);
    } catch {
      return response(false, 401, "Invalid or expired token");
    }

    console.log(decoded)

    const userId = decoded.payload.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      return response(false, 404, "User not found");
    }

    if (user.isEmailVerified) {
      return response(true, 400, "Email already verified");
    }

    await UserModel.updateOne({ _id: userId }, { isEmailVerified: true });

    console.log(`User ${userId} email verified successfully`);

    return response(true, 200, "Email verification successful");
  } catch (error) {
    return catchError(error);
  }
}

