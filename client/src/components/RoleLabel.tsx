import React from "react";
import { ROLE_COLORS, ROLE_LABELS } from "../utils/constants";

type Role = keyof typeof ROLE_LABELS;

interface RoleLabelProps {
  role: Role;
  size?: "sm" | "md" | "lg";
}

const RoleLabel: React.FC<RoleLabelProps> = ({ role, size = "md" }) => {
  const label = ROLE_LABELS[role] || role;
  const colorClass = ROLE_COLORS[role] || "bg-gray-100 text-gray-800";

  const sizeClass = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
    lg: "text-sm px-2.5 py-1.5",
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}
    >
      {label}
    </span>
  );
};

export default RoleLabel;
