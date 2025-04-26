import React, { useState, useEffect } from "react";
import { Store, Star, User, Calendar, MapPin, Mail } from "lucide-react";
import { dashboardApi } from "../../utils/api";
import StarRating from "../../components/StarRating";
import toast from "react-hot-toast";

interface OwnerDashboardData {
  stores: {
    id: string;
    name: string;
    email: string;
    address: string;
    totalRatings: number;
    averageRating: number;
    ratingDistribution: {
      [key: number]: number;
    };
    ratings: {
      id: string;
      rating: number;
      createdAt: string;
      updatedAt: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }[];
  }[];
  recentRatings: {
    id: string;
    rating: number;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    store: {
      id: string;
      name: string;
    };
  }[];
}

const OwnerDashboard: React.FC = () => {
  const [data, setData] = useState<OwnerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getStoreOwnerStats();
      setData(response.data);
    } catch (error) {
      console.error("Error fetching owner dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.stores.length === 0) {
    return (
      <div className="text-center py-12">
        <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No stores found</h3>
        <p className="mt-1 text-gray-500">
          You don't have any stores assigned to you yet
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="m-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Store Owner Dashboard
        </h1>
        <p className="text-gray-600">Manage your stores and view ratings</p>
      </div>

      {data.stores.map((store) => (
        <div key={store.id} className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-teal-100 rounded-full p-4 mr-4">
                  <Store className="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {store.name}
                  </h2>
                  <div className="flex items-center mt-1">
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
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-start mb-2">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">{store.address}</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <p className="text-gray-600">{store.email}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Rating Distribution
                </h3>
                {store.totalRatings > 0 ? (
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = store.ratingDistribution[star] || 0;
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
                            <Star className="h-4 w-4 text-accent-500 fill-accent-500" />
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

          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Customer Ratings
            </h3>
            {store.ratings && store.ratings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rating
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {store.ratings.map((rating) => (
                      <tr key={rating.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {rating.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {rating.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StarRating
                            value={rating.rating}
                            readOnly
                            size="sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No ratings yet</p>
            )}
          </div>
        </div>
      ))}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>

        {data.recentRatings && data.recentRatings.length > 0 ? (
          <div className="space-y-4">
            {data.recentRatings.map((rating) => (
              <div
                key={rating.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {rating.user.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      rated{" "}
                      <span className="font-medium">{rating.store.name}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <StarRating value={rating.rating} readOnly size="sm" />
                  <span className="ml-4 text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(rating.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
