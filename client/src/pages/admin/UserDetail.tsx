import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Mail, MapPin, ArrowLeft, Store, Edit } from "lucide-react";
import { userApi } from "../../utils/api";
import RoleLabel from "../../components/RoleLabel";
import StarRating from "../../components/StarRating";
import toast from "react-hot-toast";

interface UserDetailData {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  averageRating?: number;
  stores?: {
    id: string;
    name: string;
    email: string;
    address: string;
    averageRating: number;
    totalRatings: number;
  }[];
}

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await userApi.getById(id);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">User not found</h3>
        <p className="mt-1 text-gray-500 mb-6">
          The user you're looking for doesn't exist or you don't have permission
          to view them.
        </p>
        <Link to="/admin/users" className="btn btn-blue">
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="m-8">
        <Link
          to="/admin/users"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to users
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 rounded-full p-4 mr-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <div className="flex items-center mt-1">
                  <RoleLabel
                    role={user.role as "ADMIN" | "STORE_OWNER" | "USER"}
                  />
                  {user.role === "STORE_OWNER" &&
                    typeof user.averageRating !== "undefined" && (
                      <div className="ml-3 flex items-center">
                        <StarRating
                          value={user.averageRating}
                          readOnly
                          size="sm"
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>

            <Link
              to={`/admin/users/${user.id}/edit`}
              className="btn btn-blue flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">{user.address}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Account Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Last Updated</p>
                      <p className="text-sm text-gray-900">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {user.role === "STORE_OWNER" && user.stores && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-3">
                  Managed Stores
                </h2>
                <div className="space-y-4">
                  {user.stores.map((store) => (
                    <div key={store.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Store className="h-5 w-5 text-gray-400 mr-2" />
                        <Link
                          to={`/admin/stores/${store.id}`}
                          className="text-gray-900 font-medium hover:text-blue-600"
                        >
                          {store.name}
                        </Link>
                      </div>
                      <div className="flex items-center mb-2">
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
                      <div className="text-sm text-gray-500">
                        {store.address}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
