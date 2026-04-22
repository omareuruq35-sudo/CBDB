"use client";

import { usePathname } from "next/navigation";
import Chatbot from "./Chatbot";

export default function ChatbotWrapper() {
  const pathname = usePathname();

  const allowedPages = [
    "/", 
    "/guidelines",
    "/locations",
    "/register",
    "/emergency",
    "/services"
  ];

  if (!allowedPages.includes(pathname)) return null;

  return <Chatbot/>;
}