"use client"
import LoginForm from "@/components/login-form";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";

import { useEffect } from "react";
import { useSelector } from "react-redux";


export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
