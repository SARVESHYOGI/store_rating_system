import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Store,
  Star,
  MapPin,
  Mail,
  ArrowLeft,
  User,
  Calendar,
} from "lucide-react";
import { storeApi } from "../../utils/api";
import StarRating from "../../components/StarRating";
import RatingModal from "../../components/RatingModel";
import toast from "react-hot-toast";

interface StoreDetailData {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
  owner: {
    name: string;
    email: string;
  };
  ratings: {
    id: string;
    rating: number;
    createdAt: string;
    user: {
      id: string;
      name: string;
    };
  }[];
}

const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<StoreDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const fetchStoreDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await storeApi.getById(id);
      setStore(response.data);
    } catch (error) {
      console.error("Error fetching store details:", error);
      toast.error("Failed to load store details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, [id]);

  const handleRateClick = () => {
    setIsRatingModalOpen(true);
  };

  const handleRatingSubmit = () => {
    fetchStoreDetails();
  };

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Store not found</h3>
        <p className="mt-1 text-gray-500 mb-6">
          The store you're looking for doesn't exist or you don't have
          permission to view it.
        </p>
        <Link to="/stores" className="btn btn-blue">
          Back to Stores
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="m-8">
        <Link
          to="/stores"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to stores
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 rounded-full p-4 mr-4">
                <Store className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {store.name}
                </h1>
                <div className="flex items-center mt-1">
                  <StarRating value={store.averageRating} readOnly size="sm" />
                  <span className="ml-2 text-sm text-gray-500">
                    ({store.totalRatings}{" "}
                    {store.totalRatings === 1 ? "rating" : "ratings"})
                  </span>
                </div>
              </div>
            </div>

            <div>
              {store.userRating ? (
                <div className="flex flex-col items-end">
                  <p className="text-sm text-gray-600 mb-1">Your rating:</p>
                  <div className="flex items-center">
                    <StarRating value={store.userRating} readOnly size="sm" />
                    <button
                      onClick={handleRateClick}
                      className="ml-3 text-xs text-blue-600 hover:text-blue-800"
                    >
                      Update
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={handleRateClick} className="btn btn-accent">
                  <Star className="h-4 w-4 mr-2" />
                  Rate this store
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                Contact Information
              </h2>
              <div className="flex items-start mb-3">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">{store.address}</p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <p className="text-gray-600">{store.email}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                Rating Distribution
              </h2>
              {store.ratings && store.ratings.length > 0 ? (
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = store.ratings.filter(
                      (r) => r.rating === star
                    ).length;
                    const percentage =
                      store.totalRatings > 0
                        ? Math.round((count / store.totalRatings) * 100)
                        : 0;

                    return (
                      <div key={star} className="flex items-center">
                        <div className="flex items-center w-16">
                          <span className="text-sm text-gray-600 mr-1">
                            {star}
                          </span>
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                          <div
                            className="bg-yellow-500 h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 ml-2 w-10">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No ratings yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Ratings
          </h2>
          {store.ratings && store.ratings.length > 0 ? (
            <div className="space-y-6">
              {store.ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-gray-100 rounded-full p-2 mr-3">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {rating.user.name}
                        </p>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <StarRating value={rating.rating} readOnly size="sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No ratings yet</p>
          )}
        </div>
      </div>

      {isRatingModalOpen && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          storeId={store.id}
          storeName={store.name}
          currentRating={store.userRating}
          onRatingSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
};

export default StoreDetail;
