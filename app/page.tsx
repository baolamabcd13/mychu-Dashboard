"use client";
import DashboardCard from "@/components/dashboard/DashboardCard";
import {
  HandHeart,
  Images,
  LibraryBig,
  Newspaper,
  TicketCheck,
  Utensils,
  Video,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <DashboardCard
          title="Banner"
          count={5}
          icon={<Images className="size-14 text-slate-500" />}
        />
        <DashboardCard
          title="Products"
          count={5}
          icon={<Utensils className="size-14 text-slate-500" />}
        />
        <DashboardCard
          title="Media"
          count={5}
          icon={<Newspaper className="size-14 text-slate-500" />}
        />
        <DashboardCard
          title="Gallery"
          count={5}
          icon={<LibraryBig className="size-14 text-slate-500" />}
        />
        <DashboardCard
          title="Community"
          count={5}
          icon={<HandHeart className="size-14 text-slate-500" />}
        />
        <DashboardCard
          title="Featured News & Events"
          count={5}
          icon={<Newspaper className="size-14 text-slate-500" />}
        />
        <DashboardCard
          title="Other News & Events"
          count={5}
          icon={<Newspaper className="size-14 text-slate-500" />}
        />
        <DashboardCard
          title="Promotion"
          count={5}
          icon={<TicketCheck className="size-14 text-slate-500" />}
        />
        <DashboardCard
          title="Videos"
          count={5}
          icon={<Video className="size-14 text-slate-500" />}
        />
        <DashboardCard
          title="Images"
          count={5}
          icon={<Images className="size-14 text-slate-500" />}
        />
      </div>
    </>
  );
}
