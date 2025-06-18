import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  // Check if user is already signed in
  const user = await currentUser();
  
  if (user) {
    // If user is signed in, redirect to dashboard
    redirect("/dashboard");
  } else {
    // If user is not signed in, redirect to sign-in page
    redirect("/sign-in");
  }
}