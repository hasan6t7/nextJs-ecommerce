import connectDB from "@/lib/mongoDB";
import { catchError, response } from "@/lib/response";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/Models/Otp.model";
import UserModel from "@/Models/users.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    const validationSchema = zSchema.pick({
      otp: true,
      email: true,
    });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData) {
      return response(false, 401, "Invalid or Missing Input");
    }
    const { otp, email } = validatedData;
    const getOtpData = await OTPModel.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 404, "Invalid or expired otp");
    }

    const getUser = await UserModel.find({ deletedAt: null, email }).lean();

    if (!getUser) {
      return response(false, 404, "User Not Found");
    }

    const loggedInUserData = {
      _id: getUser._id,
      role: getUser.role,
      name: getUser.name,
      avatar: getUser.avatar,
    };

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: process.env.NODE_ENV === "production",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    await getOtpData.deleteOne();

    return response(true, 200, "Login Successfully Done");
  } catch (error) {
    return catchError(error);
  }
}
