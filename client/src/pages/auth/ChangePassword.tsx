import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Lock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<ChangePasswordFormData>();

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);
      await updateUserPassword(data.currentPassword, data.newPassword);
      toast.success("Password updated successfully");
      reset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Change password error:", error.message);
        toast.error("Failed to update password: " + error.message);
      } else {
        console.error("Change password error:", error);
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto m-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Change Password
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="currentPassword" className="label">
              Current Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="currentPassword"
                type="password"
                className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue focus:ring-1 focus:ring-blue ${
                  errors.currentPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
              />
            </div>
            {errors.currentPassword && (
              <p className="error-message">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="label">
              New Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="newPassword"
                type="password"
                className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue focus:ring-1 focus:ring-blue ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("newPassword", {
                  required: "New password is required",
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
            </div>
            {errors.newPassword && (
              <p className="error-message">{errors.newPassword.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Password must be 8-16 characters and include at least one
              uppercase letter and one special character.
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm New Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue focus:ring-1 focus:ring-blue ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === getValues("newPassword") ||
                    "Passwords do not match",
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={isLoading} className="btn btn-blue">
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
