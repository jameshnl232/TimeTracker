import LoginForm from "@/app/components/auth/LoginForm";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  
  

  return <LoginForm />;
}
