"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { zSchema } from "@/lib/zodSchema";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/Application/ButtonLoading";
import Link from "next/link";
import { WEB_FORGOT_PASS, WEB_REGISTER } from "@/Routes/WebRoutes";
import axios from "axios";
import OtpVerification from "@/components/Application/OtpVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";

const Login = () => {
  const [isTypePassword, setIsTypePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState();
  const dispatch = useDispatch();
  const formSchema = zSchema.pick({
    email: true,
    password: true,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const { data: LoginResponse } = await axios.post(
        "/api/auth/login",
        values,
      );
      if (!LoginResponse.success) {
        throw new Error(LoginResponse.message);
      }
      setOtpEmail(values.email);
      form.reset();
      alert(LoginResponse.message);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: OtpResponse } = await axios.post(
        "/api/auth/verify-otp",
        values,
      );
      if (!OtpResponse.success) {
        throw new Error(OtpResponse.message);
      }
      setOtpEmail("");

      alert(OtpResponse.message);
      dispatch(login(OtpResponse.data));
    } catch (error) {
      alert(error.message);
    } finally {
      setOtpVerificationLoading(false);
    }
  };

  return (
    <Card className="w-[450px] py-10">
      <CardContent>
        {!otpEmail ? (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">
              Login Into Account
            </h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="email"
                          placeholder="example@gmail.com"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type={isTypePassword ? "password" : "text"}
                          autoComplete="new-password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <button
                        onClick={() => setIsTypePassword(!isTypePassword)}
                        className="absolute top-1/2 right-2 cursor-pointer"
                        type="button"
                      >
                        {isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
                      </button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-1 text-sm text-primary">
                  <Link href={WEB_FORGOT_PASS}> Forgot Password</Link>
                </div>

                {/* Submit button */}
                <CardFooter className="p-0">
                  <ButtonLoading
                    text="Login"
                    type="submit"
                    loading={loading}
                    className={"w-full cursor-pointer"}
                  />
                </CardFooter>

                <div className="mt-3 flex items-center gap-2 text-sm">
                  <p> Don`t have an account?</p>
                  <Link className="text-primary" href={WEB_REGISTER}>
                    Create Account
                  </Link>
                </div>
              </form>
            </Form>
          </>
        ) : (
          <>
            <OtpVerification
              email={otpEmail}
              loading={otpVerificationLoading}
              onSubmit={handleOtpVerification}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default Login;
