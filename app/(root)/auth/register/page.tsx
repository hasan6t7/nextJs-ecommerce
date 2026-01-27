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
import { WEB_LOGIN } from "@/Routes/WebRoutes";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);
  const formSchema = zSchema
    .pick({
      name: true,
      email: true,
      password: true,
    })
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password and Confirm Password must be same",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegister =async (values) => {
    try {
      setLoading(true);
      const { data: RegisterResponse } =await axios.post("/api/auth/register", values);
      if(!RegisterResponse.success){
        throw new Error(RegisterResponse.message)
      }
      form.reset()
      alert(RegisterResponse.message)
    } catch (error) {
      alert(error.message)
    }finally{
      setLoading(false)
    }
  };

  return (
    <Card className="w-[450px] py-10">
      <CardContent>
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegister)}
            className="space-y-4"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      type="text"
                      placeholder="Mr. Don"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Confirm Password</FormLabel>
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

            {/* Submit button */}
            <CardFooter className="p-0">
              <ButtonLoading
                text="Register"
                type="submit"
                loading={loading}
                className={"w-full cursor-pointer"}
              />
            </CardFooter>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <p> Already have an account?</p>
              <Link className="text-primary" href={WEB_LOGIN}>
                Login
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Register;
