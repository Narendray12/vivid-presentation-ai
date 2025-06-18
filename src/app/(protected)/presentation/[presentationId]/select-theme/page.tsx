import React from "react";
import ThemePreview from "./_components/ThemePreview";

type props = {};

const Page = (props: props) => {
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <ThemePreview />
    </div>
  );
};

export default Page;