import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen flex items-center justify-center px-2 sm:px-0">{children}</div>
  );
};

export default layout;
