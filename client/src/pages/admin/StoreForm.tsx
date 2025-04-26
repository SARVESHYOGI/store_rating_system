import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { storeApi, userApi } from "../../utils/api";
import toast from "react-hot-toast";

interface StoreFormData {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

interface UserOption {
  id: string;
  name: string;
  email: string;
}

const StoreForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreFormData>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAll();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      }
    };

    const fetchStoreDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await storeApi.getById(id);
        reset(response.data);
      } catch (error) {
        console.error("Error fetching store details:", error);
        toast.error("Failed to load store details");
        navigate("/admin/stores");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
    if (isEditMode) {
      fetchStoreDetails();
    }
  }, [id, reset, navigate, isEditMode]);

  const onSubmit = async (data: StoreFormData) => {
    try {
      setLoading(true);

      if (isEditMode) {
        await storeApi.update(id!, data);
        toast.success("Store updated successfully");
      } else {
        await storeApi.create(data);
        toast.success("Store created successfully");
      }

      navigate("/admin/stores");
    } catch (error: unknown) {
      console.error("Store form error:", error);
      toast.error("Failed to save store");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? "Edit Store" : "Create New Store"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Update store information"
            : "Add a new store to the system"}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-lg shadow-md"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store Name
            </label>
            <input
              type="text"
              id="name"
              className={`w-full rounded-md border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } p-2 text-sm focus:border-blue-500 focus:ring-blue-500`}
              {...register("name", {
                required: "Store name is required",
                minLength: {
                  value: 3,
                  message: "Store name must be at least 3 characters",
                },
                maxLength: {
                  value: 60,
                  message: "Store name must be at most 60 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`w-full rounded-md border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } p-2 text-sm focus:border-blue-500 focus:ring-blue-500`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              className={`w-full rounded-md border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } p-2 text-sm focus:border-blue-500 focus:ring-blue-500`}
              {...register("address", {
                required: "Address is required",
                maxLength: {
                  value: 400,
                  message: "Address must be at most 400 characters",
                },
              })}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="ownerId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store Owner
            </label>
            <select
              id="ownerId"
              className={`w-full rounded-md border ${
                errors.ownerId ? "border-red-500" : "border-gray-300"
              } p-2 text-sm focus:border-blue-500 focus:ring-blue-500`}
              {...register("ownerId", {
                required: "Store owner is required",
              })}
            >
              <option value="">Select a store owner</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {errors.ownerId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ownerId.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Link
              to="/admin/stores"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Store"
                : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreForm;
