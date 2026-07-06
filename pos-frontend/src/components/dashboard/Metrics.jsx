import React from "react";
import { useSelector } from "react-redux";
import { metricsData } from "../../constants";
import {
  selectMenuCategories,
  selectTotalDishCount,
} from "../../redux/slices/menuSlice";

const Metrics = () => {
  const categories = useSelector(selectMenuCategories);
  const totalDishCount = useSelector(selectTotalDishCount);
  const itemsData = [
    {
      title: "Total Categories",
      value: `${categories.length}`,
      percentage: "Live",
      color: "#5b45b0",
      isIncrease: true,
    },
    {
      title: "Total Dishes",
      value: `${totalDishCount}`,
      percentage: "Live",
      color: "#285430",
      isIncrease: true,
    },
    {
      title: "Active Orders",
      value: "12",
      percentage: "12%",
      color: "#735f32",
      isIncrease: true,
    },
    {
      title: "Total Tables",
      value: "10",
      percentage: "Live",
      color: "#7f167f",
      isIncrease: true,
    },
  ];

  return (
    <div className="container mx-auto py-2 px-6 md:px-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-foreground text-xl">
            Overall Performance
          </h2>
          <p className="text-sm text-muted-foreground">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Distinctio, obcaecati?
          </p>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 rounded-md text-foreground bg-card">
          Last 1 Month
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="4"
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        {metricsData.map((metric, index) => {
          return (
            <div
              key={index}
              className="shadow-sm rounded-lg p-4"
              style={{ backgroundColor: metric.color }}
            >
              <div className="flex justify-between items-center">
                <p className="font-medium text-xs text-foreground">
                  {metric.title}
                </p>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    <path
                      d={metric.isIncrease ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                    />
                  </svg>
                  <p
                    className="font-medium text-xs"
                    style={{ color: metric.isIncrease ? "#f5f5f5" : "red" }}
                  >
                    {metric.percentage}
                  </p>
                </div>
              </div>
              <p className="mt-1 font-semibold text-2xl text-foreground">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col justify-between mt-12">
        <div>
          <h2 className="font-semibold text-foreground text-xl">
            Item Details
          </h2>
          <p className="text-sm text-muted-foreground">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Distinctio, obcaecati?
          </p>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4">

            {
                itemsData.map((item, index) => {
                    return (
                        <div key={index} className="shadow-sm rounded-lg p-4" style={{ backgroundColor: item.color }}>
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-xs text-foreground">{item.title}</p>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4" fill="none">
                              <path d="M5 15l7-7 7 7" />
                            </svg>
                            <p className="font-medium text-xs text-foreground">{item.percentage}</p>
                          </div>
                        </div>
                        <p className="mt-1 font-semibold text-2xl text-foreground">{item.value}</p>
                      </div>
                    )
                })
            }

        </div>
      </div>
    </div>
  );
};

export default Metrics;
