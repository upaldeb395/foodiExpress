// src/pages/user/Settings.tsx
import React, { useState } from "react";
import Button from "../../components/ui/Button";
import { auth } from "../../api/firebase";
import {
  updateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Settings: React.FC = () => {
  const user = auth.currentUser;

  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🔹 Update Email
  const handleUpdateEmail = async () => {
    if (!user) return;
    try {
      await updateEmail(user, email);
      toast.success("Email updated successfully!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // 🔹 Update Password
  const handleUpdatePassword = async () => {
    if (!user) return;
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      await updatePassword(user, newPassword);
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // 🔹 Delete Account
  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await deleteUser(user);
      toast.success("Account deleted successfully!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      <div className="space-y-6">
        {/* Update Email */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Update Email</h2>
          <input
            type="email"
            placeholder="Enter new email"
            className="w-full p-2 border rounded mb-2 dark:bg-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleUpdateEmail}>Save Email</Button>
        </div>

        {/* Update Password */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Change Password</h2>

          {/* New Password */}
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              className="w-full p-2 border rounded dark:bg-gray-700 pr-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500 dark:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative mb-2">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full p-2 border rounded dark:bg-gray-700 pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2 top-2 text-gray-500 dark:text-gray-300"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button onClick={handleUpdatePassword}>Update Password</Button>
        </div>

        {/* Delete Account */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2 text-red-500">Danger Zone</h2>
          <Button
            variant="outline"
            className="border-red-500 text-red-500"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
