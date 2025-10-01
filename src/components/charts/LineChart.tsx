"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { useState, useEffect } from "react";
import DateRangePicker from "../date-picker/DatePicker";
import CountUp from "react-countup";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type GroupBy = "year" | "month" | "day";

type LineChartProps = {
  title: string;
  data: { label: string; value: number }[];
  totalLabel?: string;
  onFilterChange?: (filters: { groupBy: GroupBy; startDate: Date; endDate: Date }) => void;
};

export const LineChart = ({ title, data, totalLabel = "Total", onFilterChange }: LineChartProps) => {
  const [groupBy, setGroupBy] = useState<GroupBy>("month");
  const [filteredData, setFilteredData] = useState(data);

  // Set initial date range (last 6 months)
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  const [dateRange, setDateRange] = useState({
    startDate: sixMonthsAgo,
    endDate: today,
  });

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleDateChange = ({ startDate, endDate }: { startDate: Date; endDate: Date }) => {
    setDateRange({ startDate, endDate });
    if (onFilterChange) {
      onFilterChange({ groupBy, startDate, endDate });
    }
  };

  const handleGroupByChange = (newGroupBy: GroupBy) => {
    setGroupBy(newGroupBy);
    if (onFilterChange) {
      onFilterChange({ groupBy: newGroupBy, startDate: dateRange.startDate, endDate: dateRange.endDate });
    }
  };

  const total = filteredData.reduce((sum, item) => sum + item.value, 0);

  const chartData = {
    labels: filteredData.map((item) => item.label),
    datasets: [
      {
        label: title,
        data: filteredData.map((item) => item.value),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.3)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(99, 102, 241, 0.5)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#6B7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
            <div className="flex items-baseline gap-2 mt-1 sm:mt-2">
              <span className="text-2xl sm:text-3xl font-bold text-indigo-600">
                <CountUp end={total} duration={1} />
              </span>
              <span className="text-xs sm:text-sm text-gray-600">{totalLabel}</span>
            </div>
          </div>

          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => handleGroupByChange("year")}
              className={`px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors ${
                groupBy === "year"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Year
            </button>
            <button
              onClick={() => handleGroupByChange("month")}
              className={`px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors ${
                groupBy === "month"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleGroupByChange("day")}
              className={`px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm font-medium transition-colors ${
                groupBy === "day"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Day
            </button>
          </div>
        </div>

        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={handleDateChange}
        />
      </div>

      <div className="h-64 sm:h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};
