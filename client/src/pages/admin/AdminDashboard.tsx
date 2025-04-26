import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Store, Star, BarChart, ChevronRight, User } from "lucide-react";
import { dashboardApi } from "../../utils/api";
import StatCard from "../../components/StatCard";
import RoleLabel from "../../components/RoleLabel";
import StarRating from "../../components/StarRating";
import toast from "react-hot-toast";

interface DashboardData {
  counts: {
    users: number;
    stores: number;
    ratings: number;
  };
  usersByRole: {
    ADMIN: number;
    USER: number;
    STORE_OWNER: number;
  };
  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
  recentStores: {
    id: string;
    name: string;
    ownerName: string;
    createdAt: string;
    averageRating: number;
    totalRatings: number;
  }[];
  recentRatings: {
    id: string;
    rating: number;
    createdAt: string;
    user: {
      name: string;
    };
    store: {
      name: string;
    };
  }[];
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardApi.getAdminStats();
      setData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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

  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          Dashboard data not available
        </h3>
        <p className="mt-1 text-gray-500">Please try again later</p>
      </div>
    );
  }

  return (
    <div>
      <div className="m-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of system statistics and activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={data.counts.users}
          icon={User}
          color="bg-pink-500"
        />

        <StatCard
          title="Total Stores"
          value={data.counts.stores}
          icon={Store}
          color="bg-teal-500"
        />

        <StatCard
          title="Total Ratings"
          value={data.counts.ratings}
          icon={Star}
          color="bg-yellow-500"
        />

        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-sm font-medium text-gray-500 mb-4">
            Users by Role
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <RoleLabel role="ADMIN" />
              <span className="font-semibold">
                {data.usersByRole.ADMIN || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <RoleLabel role="STORE_OWNER" />
              <span className="font-semibold">
                {data.usersByRole.STORE_OWNER || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <RoleLabel role="USER" />
              <span className="font-semibold">
                {data.usersByRole.USER || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Users
            </h2>
            <Link
              to="/admin/users"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
            >
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {data.recentUsers && data.recentUsers.length > 0 ? (
            <div className="space-y-4">
              {data.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded-full p-2 mr-3">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {user.name}
                      </Link>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-500 mr-2">
                          {user.email}
                        </p>
                        <RoleLabel
                          role={user.role as "ADMIN" | "USER" | "STORE_OWNER"}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No users found</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Stores
            </h2>
            <Link
              to="/admin/stores"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
            >
              View all
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {data.recentStores && data.recentStores.length > 0 ? (
            <div className="space-y-4">
              {data.recentStores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center">
                    <div className="bg-teal-100 rounded-full p-2 mr-3">
                      <Store className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <Link
                        to={`/admin/stores/${store.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {store.name}
                      </Link>
                      <div className="flex items-center mt-1">
                        <p className="text-xs text-gray-500 mr-2">
                          Owner: {store.ownerName}
                        </p>
                        <div className="flex items-center">
                          <StarRating
                            value={store.averageRating}
                            readOnly
                            size="sm"
                          />
                          <span className="ml-1 text-xs text-gray-500">
                            ({store.totalRatings})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(store.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No stores found</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Ratings
          </h2>
        </div>

        {data.recentRatings && data.recentRatings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Store
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
                {data.recentRatings.map((rating) => (
                  <tr key={rating.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rating.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {rating.store.name}
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
          <p className="text-gray-500 text-center py-6">No ratings found</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
