import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { CardFooter } from "../ui/card";
import ButtonLoading from "./ButtonLoading";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import axios from "axios";

const OtpVerification = ({ email, onSubmit, loading }) => {
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const formSchema = zSchema.pick({
    otp: true,
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email: email,
    },
  });

  const handleOtpVerification = async (values) => {
    onSubmit(values);
  };

  const handleResendOtp = async () => {
    try {
      setIsResendingOtp(true);
      const { data: ResendOtpResponse } = await axios.post("/api/auth/resend-otp", {email});
      if (!ResendOtpResponse.success) {
        throw new Error(ResendOtpResponse.message);
      }
     
      alert(ResendOtpResponse.message);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsResendingOtp(false);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleOtpVerification)}
          className="space-y-4"
        >
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              Please complete Verification!
            </h1>
            <p>
              We have sent your an One Time Password (OTP) to your registered
              email. The OTP is valid for 10 munites only
            </p>
          </div>
          <div className="flex justify-center mt-5 mb-5">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>One Time Password (OTP)</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot className="text-xl size-10" index={0} />
                        <InputOTPSlot className="text-xl size-10" index={1} />
                        <InputOTPSlot className="text-xl size-10" index={2} />
                        <InputOTPSlot className="text-xl size-10" index={3} />
                        <InputOTPSlot className="text-xl size-10" index={4} />
                        <InputOTPSlot className="text-xl size-10" index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit button */}
          <CardFooter className="p-0">
            <ButtonLoading
              text="Verify"
              type="submit"
              loading={loading}
              className={"w-full cursor-pointer"}
            />
          </CardFooter>
          <div className="text-center mt-5">
            {!isResendingOtp ? (
              <>
                <button
                  onClick={handleResendOtp}
                  type="button"
                  className="cursor-pointer text-primary "
                >
                  Resend OTP
                </button>
              </>
            ) : (
              <span>Resending...</span>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default OtpVerification;
