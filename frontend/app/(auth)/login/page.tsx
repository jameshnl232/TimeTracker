"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-300 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue tracking your time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="flex w-full items-center gap-2" size="lg">
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
