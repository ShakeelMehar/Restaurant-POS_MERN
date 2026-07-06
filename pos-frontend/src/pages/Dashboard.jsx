import React, { useEffect } from "react";
import Greetings from "../components/home/Greetings";
import { FiDollarSign, FiClock } from "react-icons/fi";
import MiniCard from "../components/home/MiniCard";
import RecentOrders from "../components/home/RecentOrders";
import PopularDishes from "../components/home/PopularDishes";

const Dashboard = () => {
  useEffect(() => {
    document.title = "POS | Admin Dashboard";
  }, []);

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-background pb-24 xl:flex xl:gap-0">
      {/* ── LEFT COLUMN ── */}
      <div className="flex-[3] min-w-0">
        <Greetings />

        {/* Stats Row */}
        <div className="flex items-stretch gap-2 px-4 mt-5">
          <MiniCard
            title="Total Earnings"
            icon={<FiDollarSign />}
            number={512}
            footerNum={1.6}
          />
          <MiniCard
            title="In Progress"
            icon={<FiClock />}
            number={16}
            footerNum={3.6}
          />
        </div>

        <RecentOrders />
      </div>

      {/* ── RIGHT COLUMN ── */}
      <div className="xl:w-[320px] xl:flex-shrink-0 xl:border-l border-border min-w-0">
        <PopularDishes />
      </div>
    </section>
  );
};

export default Dashboard;
