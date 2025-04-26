import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  maxRating?: number;
  activeColor?: string; // New prop for active star color
  inactiveColor?: string; // New prop for inactive star color
  hoverColor?: string; // New prop for hover state color
}

const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onChange,
  size = "md",
  readOnly = false,
  maxRating = 5,
  activeColor = "text-yellow-500 fill-yellow-500",
  inactiveColor = "text-gray-300",
  hoverColor = "text-yellow-400 fill-yellow-400",
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-8 h-8";
      default:
        return "w-6 h-6";
    }
  };

  const sizeClass = getSizeClasses();

  const handleMouseEnter = (rating: number) => {
    if (readOnly) return;
    setHoverRating(rating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const handleClick = (rating: number) => {
    if (readOnly || !onChange) return;
    onChange(rating);
  };

  const stars = Array.from({ length: maxRating }, (_, i) => i + 1).map(
    (rating) => {
      const isFilled = hoverRating ? rating <= hoverRating : rating <= value;
      const isHovered = hoverRating > 0 && rating <= hoverRating;
      return (
        <Star
          key={rating}
          className={`${sizeClass} transition-colors ${
            isFilled ? (isHovered ? hoverColor : activeColor) : inactiveColor
          } ${!readOnly && "cursor-pointer"}`}
          strokeWidth={1.5}
          onClick={() => handleClick(rating)}
          onMouseEnter={() => handleMouseEnter(rating)}
          onMouseLeave={handleMouseLeave}
        />
      );
    }
  );

  return (
    <div className="flex">
      {stars}
      {!readOnly && (
        <span className="ml-2 text-sm text-gray-500">
          {hoverRating > 0 ? hoverRating : value} out of {maxRating}
        </span>
      )}
    </div>
  );
};

export default StarRating;
