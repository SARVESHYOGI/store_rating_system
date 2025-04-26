import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { userApi } from "../../utils/api";
import { USER_ROLES, ROLE_LABELS } from "../../utils/constants";
import toast from "react-hot-toast";

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  address: string;
  role: string;
}

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await userApi.getById(id);
        reset(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to load user details");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      fetchUserDetails();
    }
  }, [id, reset, navigate, isEditMode]);

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);

      if (isEditMode) {
        if (!data.password) {
          delete data.password;
        }
        await userApi.update(id!, data);
        toast.success("User updated successfully");
      } else {
        await userApi.create(data);
        toast.success("User created successfully");
      }

      navigate("/admin/users");
    } catch (error) {
      console.error("User form error:", error);
      toast.error("Failed to save user");
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
      <div className="m-8 ">
        <Link
          to="/admin/users"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to users
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditMode ? "Edit User" : "Create New User"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Update user information"
            : "Add a new user to the system"}
        </p>
      </div>

      <div className=" flex mx-auto justify-center rounded-lg shadow-sm p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg bg-white p-6 shadow-md"
        >
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue focus:ring-1 focus:ring-blue ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                maxLength: {
                  value: 60,
                  message: "Name must be at most 60 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue focus:ring-1 focus:ring-blue ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              {isEditMode
                ? "New Password (leave blank to keep current)"
                : "Password"}
            </label>
            <input
              type="password"
              id="password"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue focus:ring-1 focus:ring-blue ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password", {
                ...(!isEditMode ? { required: "Password is required" } : {}),
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 16,
                  message: "Password must be at most 16 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
                  message:
                    "Password must contain at least one uppercase letter and one special character",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Password must be 8-16 characters and include at least one
              uppercase letter and one special character.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue focus:ring-1 focus:ring-blue ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              {...register("address", {
                required: "Address is required",
                maxLength: {
                  value: 400,
                  message: "Address must be at most 400 characters",
                },
              })}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium text-gray-700">
              User Role
            </label>
            <select
              id="role"
              className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue focus:ring-1 focus:ring-blue ${
                errors.role ? "border-red-500" : "border-gray-300"
              }`}
            >
              {Object.entries(USER_ROLES).map(([key, value]) => (
                <option key={key} value={value}>
                  {ROLE_LABELS[value as keyof typeof ROLE_LABELS]}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-sm text-red-500"> {errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Link
              to="/admin/users"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-black hover:bg-green-600 disabled:opacity-50"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update User"
                : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
