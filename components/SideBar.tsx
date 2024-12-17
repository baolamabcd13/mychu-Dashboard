"use client";
import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import Link from "next/link";
import {
  LayoutDashboard,
  Images,
  Utensils,
  Newspaper,
  LibraryBig,
  HandHeart,
  TicketCheck,
  Video,
  Settings,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <Command className="bg-secondary rounded-none min-h-screen overflow-hidden">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="overflow-visible">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Home Page">
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${pathname === "/" ? "bg-slate-200 dark:bg-slate-700" : ""}`}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <Link href="/" className="w-full">
                Dashboard
              </Link>
            </CommandItem>
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/banners"
                    ? "bg-slate-200 dark:bg-slate-700"
                    : ""
                }`}
            >
              <Images className="mr-2 h-4 w-4" />
              <Link href="/banners" className="w-full">
                Banner
              </Link>
            </CommandItem>
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/products"
                    ? "bg-slate-200 dark:bg-slate-700"
                    : ""
                }`}
            >
              <Utensils className="mr-2 h-4 w-4" />
              <Link href="/products" className="w-full">
                Products
              </Link>
            </CommandItem>
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/media" ? "bg-slate-200 dark:bg-slate-700" : ""
                }`}
            >
              <Newspaper className="mr-2 h-4 w-4" />
              <Link href="/media" className="w-full">
                Media
              </Link>
            </CommandItem>
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/gallery"
                    ? "bg-slate-200 dark:bg-slate-700"
                    : ""
                }`}
            >
              <LibraryBig className="mr-2 h-4 w-4" />
              <Link href="/gallery" className="w-full">
                Gallery
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="About Page">
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/community"
                    ? "bg-slate-200 dark:bg-slate-700"
                    : ""
                }`}
            >
              <HandHeart className="mr-2 h-4 w-4" />
              <Link href="/community" className="w-full">
                Community
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />

          <CommandGroup heading="Products Page">
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/products"
                    ? "bg-slate-200 dark:bg-slate-700"
                    : ""
                }`}
            >
              <Utensils className="mr-2 h-4 w-4" />
              <Link href="/products" className="w-full">
                Products
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />

          <CommandGroup heading="Communication & Promotion">
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/news" ? "bg-slate-200 dark:bg-slate-700" : ""
                }`}
            >
              <Newspaper className="mr-2 h-4 w-4" />
              <Link href="/news" className="w-full">
                Featured News & Events
              </Link>
            </CommandItem>
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/news" ? "bg-slate-200 dark:bg-slate-700" : ""
                }`}
            >
              <Newspaper className="mr-2 h-4 w-4" />
              <Link href="/news" className="w-full">
                Other News & Events
              </Link>
            </CommandItem>
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/promotion"
                    ? "bg-slate-200 dark:bg-slate-700"
                    : ""
                }`}
            >
              <TicketCheck className="mr-2 h-4 w-4" />
              <Link href="/promotion" className="w-full">
                Promotion
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Gallery">
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/videos" ? "bg-slate-200 dark:bg-slate-700" : ""
                }`}
            >
              <Video className="mr-2 h-4 w-4" />
              <Link href="/videos" className="w-full">
                Videos
              </Link>
            </CommandItem>
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/images" ? "bg-slate-200 dark:bg-slate-700" : ""
                }`}
            >
              <Images className="mr-2 h-4 w-4" />
              <Link href="/images" className="w-full">
                Images
              </Link>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />

          <CommandGroup heading="Settings">
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/profile"
                    ? "bg-slate-200 dark:bg-slate-700"
                    : ""
                }`}
            >
              <User className="mr-2 h-4 w-4" />
              <Link href="/profile" className="w-full">
                Profile
              </Link>
            </CommandItem>
            <CommandItem
              className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                ${
                  pathname === "/settings"
                    ? "bg-slate-200 dark:bg-slate-700"
                    : ""
                }`}
            >
              <Settings className="mr-2 h-4 w-4" />
              <Link href="/settings" className="w-full">
                Settings
              </Link>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default Sidebar;
