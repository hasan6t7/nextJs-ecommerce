import { otpEmail } from "@/email/otpEmail";
import { generateOTP } from "@/lib/generateOTP";
import connectDB from "@/lib/mongoDB";
import { catchError, response } from "@/lib/response";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/Models/Otp.model";
import UserModel from "@/Models/users.model";

export async function POST(request) {
  try {
    await connectDB();
    const payload = await request.json();
    const validationSchema = zSchema.pick({
      email: true,
    });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData) {
      return response(false, 401, "Missing input field", validatedData.error);
    }
    const { email } = validatedData.data;
    const getUser = await UserModel.find({ email });
    if (!getUser) {
      return response(false, 404, "User Not Found");
    }

    await OTPModel.deleteMany();
    const otp = generateOTP();
    const newOtpData = new OTPModel({ email, otp });
    await newOtpData.save();

    const otpSendStatus = await sendMail(
      "Your Login Verification OTP",
      email,
      otpEmail(otp),
    );
    if (!otpSendStatus.success) {
      return response(false, 401, "Failed to resend OTP");
    }
    return response(true, 200, "OTP sent successfully");
  } catch (error) {
    catchError(error);
  }
}
