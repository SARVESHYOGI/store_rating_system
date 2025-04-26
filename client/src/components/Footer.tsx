import React from "react";
import { Star } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Star className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-bold text-blue-800">
              StoreRatings
            </span>
          </div>

          <div className="text-sm text-gray-500">
            &copy; {currentYear} StoreRatings. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
