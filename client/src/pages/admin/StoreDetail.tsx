import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Store, Star, MapPin, Mail, ArrowLeft, User, Edit } from "lucide-react";
import { storeApi } from "../../utils/api";
import StarRating from "../../components/StarRating";
import RoleLabel from "../../components/RoleLabel";
import toast from "react-hot-toast";

interface StoreDetailData {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  totalRatings: number;
  owner: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  ratings: {
    id: string;
    rating: number;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }[];
}

const StoreDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<StoreDetailData | null>(null);
  const [loading, setLoading] = useState(true);

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
        <Link to="/admin/stores" className="btn btn-blue">
          Back to Stores
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="m-8">
        <Link
          to="/admin/stores"
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

            <Link
              to={`/admin/stores/${store.id}/edit`}
              className="btn btn-blue flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Store
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                Store Information
              </h2>
              <div className="flex items-start mb-3">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">{store.address}</p>
              </div>
              <div className="flex items-center mb-4">
                <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                <p className="text-gray-600">{store.email}</p>
              </div>

              <h3 className="text-md font-medium text-gray-900 mb-2">
                Store Owner
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="bg-gray-200 rounded-full p-2">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="ml-3">
                    <Link
                      to={`/admin/users/${store.owner.id}`}
                      className="font-medium text-gray-900 hover:text-blue-600"
                    >
                      {store.owner.name}
                    </Link>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500 mr-2">
                        {store.owner.email}
                      </p>
                      <RoleLabel
                        role={
                          store.owner.role as "ADMIN" | "STORE_OWNER" | "USER"
                        }
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
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
                          <Star className="h-4 w-4 text-accent-500 fill-accent-500" />
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                          <div
                            className="bg-accent-500 h-2.5 rounded-full"
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
            Customer Ratings
          </h2>
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
                            <Link
                              to={`/admin/users/${rating.user.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600"
                            >
                              {rating.user.name}
                            </Link>
                            <div className="text-sm text-gray-500">
                              {rating.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StarRating value={rating.rating} readOnly size="sm" />
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
    </div>
  );
};

export default StoreDetail;
