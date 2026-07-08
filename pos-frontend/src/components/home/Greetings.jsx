import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const greetingMessage = (hours) => {
  if (hours < 12) return "Good Morning";
  if (hours < 17) return "Good Afternoon";
  return "Good Evening";
};

const Greetings = () => {
  const userData = useSelector((state) => state.user);
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = dateTime.getHours();
  const greeting = greetingMessage(hours);

  const formatTime = (d) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;

  const formatDate = (d) => {
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")} ${d.getFullYear()}`;
  };

  return (
    <div className="mx-6 mt-6 rounded-[14px] border border-border bg-card p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: greeting */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{hours < 12 ? "☀️" : hours < 17 ? "🌤️" : "🌙"}</span>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">{greeting}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            {userData.name || "Team Member"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Give your best service today ✨
          </p>
        </div>

        {/* Right: live clock */}
        <div className="flex flex-col items-start sm:items-end rounded-xl px-4 py-2">
          <p className="text-3xl font-extrabold text-foreground tracking-tight font-mono tabular-nums">
            {formatTime(dateTime)}
          </p>
          <p className="text-xs text-muted-foreground font-semibold mt-0.5">{formatDate(dateTime)}</p>
        </div>
      </div>
    </div>
  );
};

export default Greetings;
