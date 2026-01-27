import { NextResponse } from "next/server";

export const response = (success, statuscode, message, data = {}) => {
  return NextResponse.json({
    success,
    statuscode,
    message,
    data,
  });
};

export const catchError = (error, customMessage) => {
  if (error.code === 11000 && error.keyPattern) {
    const keys = Object.keys(error.keyPattern).join(", ");
    error.message = `Duplicate field: ${keys}. These fields' values must be unique.`;
  }

  let errorObj = {};

  if (process.env.NODE_ENV === "development") {
    errorObj = {
      message: error.message,
      error,
    };
  } else {
    errorObj = {
      message: customMessage || "Internal Server Error",
    };
  }

  // Use 500 as fallback if error.code is undefined
  const statusCode = error.code || 500;

  return response(false, statusCode, errorObj.message, errorObj.error || {});
};
