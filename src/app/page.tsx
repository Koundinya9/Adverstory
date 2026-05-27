"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasProfile } from "@/lib/profile";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(hasProfile() ? "/create" : "/profile");
  }, [router]);

  return null;
}
