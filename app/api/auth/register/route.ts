import { emailVerificationLink } from "@/email/emailVerificationLink";
import connectDB from "@/lib/mongoDB";
import { catchError, response } from "@/lib/response";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/Models/users.model";
import { SignJWT } from "jose";

export async function POST(request) {
  try {
    await connectDB();
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });
    const payload = await request.json();
    const validationData = validationSchema.safeParse(payload);
    if (!validationData.success) {
      return response(
        false,
        401,
        "Invalid or Missing Input Field",
        validationData.error,
      );
    }

    const { name, email, password } = validationData.data;

    // already register
    const checkUser = await UserModel.exists({ email });
    if (checkUser) {
      return response(true, 409, "User Already Registered");
    }

    // new register
    const newRegister = new UserModel({
      name,
      email,
      password,
    });

    await newRegister.save();

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ userId: newRegister._id })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    await sendMail(
      "Email Verification From Hasan",
      email,
      emailVerificationLink(
        `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`,
      ),
    );
    return response(
      true,
      201,
      "Registration Successfully Done , Please Verify Your Email",
    );
  } catch (error) {
    return catchError(error, "From Catch error");
  }
}
