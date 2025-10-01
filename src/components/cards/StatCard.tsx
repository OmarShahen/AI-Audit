"use client";

import { ReactNode } from "react";
import CountUp from "react-countup";

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  bgColor: string;
};

export const StatCard = ({ title, value, icon, bgColor }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            <CountUp end={value} duration={1} />
          </p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
};
