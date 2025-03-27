"use client";

import Header from "@/components/global/header";
import Footer from "@/components/global/footer";
import { usePathname } from "next/navigation";

export default function LayoutRenderer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBCaptchaRoute = pathname === "/bcaptcha";

  if (isBCaptchaRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
