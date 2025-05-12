import Image from "next/image";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full lg:flex-row flex-col">
      <Image className="lg:flex-1 object-cover w-full h-1/2" src="/bg-auth.avif" width={1000} height={800} alt="background" />
      {children}
    </div>
  )
}