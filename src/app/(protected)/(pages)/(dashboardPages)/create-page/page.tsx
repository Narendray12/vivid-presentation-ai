import React, { Suspense } from "react";
import CreatePageSkeleton from "./_components/createPage/createPageSkeleton";
import RenderPage from "./RenderPage";
type props = {};

const Page = (props: props) => {
  return (
    <main className="w-full h-wull pt-6">
        <Suspense
        fallback={<CreatePageSkeleton />}>
            <RenderPage />
        </Suspense>
    </main>
  );
};

export default Page;
