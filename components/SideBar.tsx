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
  Image,
} from "lucide-react";
import { usePathname } from "next/navigation";

export const sidebarLinks = [
  {
    title: "Home Page",
    links: [
      {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Banner",
        href: "/banners",
        icon: Images,
      },
      {
        title: "Products",
        href: "/products",
        icon: Utensils,
      },
      {
        title: "Media",
        href: "/medias",
        icon: Newspaper,
      },
    ],
  },
  {
    title: "About Page",
    links: [
      {
        title: "Community",
        href: "/community",
        icon: HandHeart,
      },
    ],
  },
  {
    title: "Products Page",
    links: [
      {
        title: "Products",
        href: "/products",
        icon: Utensils,
      },
    ],
  },
  {
    title: "Communication & Promotion",
    links: [
      {
        title: "Featured News & Events",
        href: "/news",
        icon: Newspaper,
      },
      {
        title: "Other News & Events",
        href: "/news",
        icon: Newspaper,
      },
      {
        title: "Promotion",
        href: "/promotion",
        icon: TicketCheck,
      },
    ],
  },
  {
    title: "Gallery",
    href: "/gallery",
    links: [
      {
        title: "Images",
        href: "/gallery/images",
        icon: Image,
      },
      {
        title: "Videos",
        href: "/gallery/videos",
        icon: Video,
      },
    ],
  },
  {
    title: "Settings",
    links: [
      {
        title: "Profile",
        href: "/profile",
        icon: User,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <Command className="bg-secondary rounded-none min-h-screen overflow-hidden">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="overflow-visible">
          <CommandEmpty>No results found.</CommandEmpty>
          {sidebarLinks.map((group, index) => (
            <React.Fragment key={index}>
              <CommandGroup heading={group.title}>
                {group.links.map((link, index) => (
                  <CommandItem
                    key={index}
                    className={`cursor-pointer [&:hover]:bg-slate-200 dark:[&:hover]:bg-slate-700
                      ${
                        pathname === link.href
                          ? "bg-slate-200 dark:bg-slate-700"
                          : ""
                      }`}
                  >
                    <link.icon className="mr-2 h-4 w-4" />
                    <Link href={link.href} className="w-full">
                      {link.title}
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </React.Fragment>
          ))}
        </CommandList>
      </Command>
    </div>
  );
};

export default Sidebar;
