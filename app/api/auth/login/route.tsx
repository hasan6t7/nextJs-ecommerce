import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { generateOTP } from "@/lib/generateOTP";
import connectDB from "@/lib/mongoDB";
import { catchError, response } from "@/lib/response";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/Models/Otp.model";
import UserModel from "@/Models/users.model";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();

    const validationSchema = zSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string(),
      });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or Missing Field",
        validatedData.error,
      );
    }

    const { email, password } = validatedData.data;
    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password",
    );
    if (!getUser) {
      return response(false, 400, "Invalid Login Credentials");
    }

    if (!getUser.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      await sendMail(
        "Email Verification From Hasan",
        email,
        emailVerificationLink(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`,
        ),
      );

      return response(
        false,
        401,
        "Your Email is not verified. Verification link sent to your registered email address",
      );
    }

    const isPasswordVerified = await getUser.comparePassword(password);
    if (!isPasswordVerified) {
      return response(false, 400, "Invalid Login Credentials");
    }

    // otp

    await OTPModel.deleteMany({ email });
    const otp = generateOTP();
    const newOTPData = new OTPModel({
      email,
      otp,
    });

    await newOTPData.save();

    const otpEmailStatus = await sendMail(
      "Your Login Verification Mail",
      email,
      otpEmail(otp),
    );

    if (!otpEmailStatus.success) {
      return response(false, 400, "Failed to sent OTP");
    }
    return response(true, 200, "Please Verify Your Device");
  } catch (error) {
    return catchError(error);
  }
}
