"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useState, useEffect } from "react";
import DateRangePicker from "../date-picker/DatePicker";

ChartJS.register(ArcElement, Tooltip, Legend);

type DonutChartProps = {
  title: string;
  data: { label: string; value: number; color: string }[];
};

export const DonutChart = ({ title, data }: DonutChartProps) => {
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
    // Filter logic can be implemented based on your data structure
    setFilteredData(data);
  };

  const chartData = {
    labels: filteredData.map((item) => item.label),
    datasets: [
      {
        data: filteredData.map((item) => item.value),
        backgroundColor: filteredData.map((item) => item.color),
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          color: "#374151",
          font: {
            size: 14,
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i] as number;
                const backgroundColor = (data.datasets[0].backgroundColor as string[])[i];
                return {
                  text: `${label}: ${value}`,
                  fillStyle: backgroundColor,
                  hidden: false,
                  index: i,
                  strokeStyle: backgroundColor,
                  pointStyle: "circle",
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(99, 102, 241, 0.5)",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (acc: number, curr) => acc + (curr as number),
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={handleDateChange}
        />
      </div>

      <div className="h-80">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};
