import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Store, Star, MapPin, Mail } from "lucide-react";
import { storeApi } from "../../utils/api";
import StarRating from "../../components/StarRating";
import RatingModal from "../../components/RatingModel";
import toast from "react-hot-toast";

interface StoreData {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
}

const StoreList: React.FC = () => {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);

  const fetchStores = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await storeApi.getAll(filters);
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast.error("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: {
      name?: string;
      // address?: string;
    } = {};

    if (searchTerm) {
      filters.name = searchTerm;
      // filters.address = searchTerm;
    }

    fetchStores(filters);
  };

  const handleRateClick = (store: StoreData) => {
    setSelectedStore(store);
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = () => {
    fetchStores();
  };

  return (
    <div>
      <div className="m-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Stores</h1>
        <p className="text-gray-600">Browse and rate stores</p>
      </div>

      <div className="mb-6">
        <div className="flex-grow">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative flex-grow bg-gray-100 rounded-l-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10 pr-4 py-2 rounded-l-md focus:ring-blue-500 focus:border-blue-500 w-full"
                placeholder="Search stores by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-blue rounded-l-none rounded-r-2xl bg-gray-400  px-2"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-12">
          <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No stores found</h3>
          <p className="mt-1 text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="card card-hover transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Store className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {store.name}
                  </h2>
                  <div className="flex items-center">
                    <StarRating
                      value={store.averageRating}
                      readOnly
                      size="sm"
                    />
                    <span className="ml-2 text-sm text-gray-500">
                      ({store.totalRatings}{" "}
                      {store.totalRatings === 1 ? "rating" : "ratings"})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start mb-2">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">{store.address}</p>
              </div>

              <div className="flex items-center mb-4">
                <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">{store.email}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-auto">
                {store.userRating ? (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Your rating:</p>
                    <div className="flex items-center">
                      <StarRating value={store.userRating} readOnly size="sm" />
                      <button
                        onClick={() => handleRateClick(store)}
                        className="ml-3 text-xs text-blue-600 hover:text-blue-800"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleRateClick(store)}
                    className="btn btn-accent mb-4"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Rate this store
                  </button>
                )}

                <div className="flex justify-between">
                  <Link
                    to={`/stores/${store.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedStore && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          storeId={selectedStore.id}
          storeName={selectedStore.name}
          currentRating={selectedStore.userRating}
          onRatingSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default StoreList;
