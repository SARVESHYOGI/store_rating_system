import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  change?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>

          {typeof change !== "undefined" && (
            <p
              className={`text-xs font-medium mt-2 ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </p>
          )}
        </div>

        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
          <Icon className={`h-6 w-6  ${color.replace("bg-", "text-")} `} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
