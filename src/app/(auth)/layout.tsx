import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-background">
      {children}
    </div>
  );
};

export default Layout;