import React from "react";
import { Star } from "lucide-react";

const RatingStars = ({
  rating = 0,
  maxStars = 5,
  size = "w-4 h-4",
  starColor = "text-yellow-400",
  emptyColor = "text-gray-600",
  interactive = false,
  onRate = null,
}) => {
  const numericRating = Number(rating) || 0;

  return (
    <div className="inline-flex items-center space-x-1">
      {[...Array(maxStars)].map((_, i) => {
        // Calculate fill percentage for star i (from 0% to 100%)
        const fillPercent = Math.max(
          0,
          Math.min(100, Math.round((numericRating - i) * 100))
        );

        return (
          <span
            key={i}
            className={`relative inline-block ${size} ${
              interactive ? "cursor-pointer transition-transform hover:scale-110" : ""
            }`}
            onClick={() => interactive && onRate && onRate(i + 1)}
          >
            {/* Empty Background Star */}
            <Star className={`${size} ${emptyColor} absolute inset-0`} />

            {/* Filled Foreground Star with percentage width */}
            {fillPercent > 0 && (
              <span
                className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
                style={{ width: `${fillPercent}%` }}
              >
                <Star className={`${size} ${starColor} fill-current`} />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default RatingStars;
