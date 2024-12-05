import SignupForm from "@/app/components/auth/SignupForm";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function SignupPage() {
 

  return <SignupForm />;
}
