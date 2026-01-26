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

const Login = () => {
  const [isTypePassword, setIsTypePassword] = useState(true);
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

  const handleLogin = (data: z.infer<typeof formSchema>) => {
    console.log("Login data:", data);
    // TODO: Call your login API here
  };

  return (
    <Card className="w-[450px] py-10">
      <CardContent>
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login Into Account
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
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
              <Link href={"/forgot-password"}> Forgot Password</Link>
            </div>

            {/* Submit button */}
            <CardFooter className="p-0">
              <ButtonLoading text="Login" type="submit" className={"w-full cursor-pointer"} />
            </CardFooter>

            <div className="mt-3 flex items-center gap-2 text-sm">
                <p> Don`t have an account?</p>
                <Link className="text-primary" href={"/register"}>Create Account</Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Login;
