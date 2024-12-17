import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import SideBar from "@/components/SideBar";

export const metadata: Metadata = {
  title: "Mì Chũ - Admin Dashboard",
  description: "Mì Chũ - Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-baloo antialiased">
        <NavBar />
        <div className="flex">
          <div className="hidden md:block h-[100vh]">
            <SideBar />
          </div>
          <div className="p-5 w-full md:w-[calc(100vw-250px)]">{children}</div>
        </div>
      </body>
    </html>
  );
}
