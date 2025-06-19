import React, { Suspense } from "react";
import CreatePageSkeleton from "./_components/createPage/createPageSkeleton";
import RenderPage from "./RenderPage";
import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";
type props = {};

const Page = async (props: props) => {
    const checkUser = await onAuthenticateUser();
    if(!checkUser.user){
      redirect('/sign-in')
    }
    if(!checkUser.user.subscription){
      redirect('/dashboard')
    }
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
