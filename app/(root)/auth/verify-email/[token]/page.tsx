"use client";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import verifiedImg from "@/public/assets/images/verified.gif";
import verificationFailedImg from "@/public/assets/images/verification-failed.gif";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEB_HOME } from "@/Routes/WebRoutes";

const EmailVerification = ({ params }) => {
  const { token } = use(params);
  
  const [isVerified, setIsVerified] = useState(false);
  const [message , setMessage] = useState("")

  useEffect(() => {
    const verify = async () => {
      const { data } = await axios.post("/api/auth/verify-email", token);
      if (data.success) {
        setIsVerified(true);
        setMessage(data.message)
      }
    };

    verify();
  }, [token]);
  return (
    <Card className="w-[400px]">
      <CardContent>
        {isVerified ? (
          <div>
            <div className="flex items-center justify-center">
              <Image src={verifiedImg} height={100} alt="Verified" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-green-500 my-5">
                
                {message}
              </h1>
              <Button asChild>
                <Link href={WEB_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center">
              <Image src={verificationFailedImg} height={100} alt="Verification Failed" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-500 my-5">
                Email Verification Failed!
              </h1>
              <Button asChild>
                <Link href={WEB_HOME}>Continue Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
