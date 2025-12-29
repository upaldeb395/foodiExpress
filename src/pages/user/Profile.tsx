import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Bell, Settings, CreditCard, Gift } from "lucide-react";
import { useAuthStore } from "../../store";
import Button from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";

// Firebase
import { db } from "../../api/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};
const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 shadow sm:rounded-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // 🔹 State for real-time data
  const [ordersCount, setOrdersCount] = useState(0);
  const [addressesCount, setAddressesCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Fetch Orders Count
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), where("userId", "==", user.id));
        const snapshot = await getDocs(q);
        setOrdersCount(snapshot.size);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    // Fetch Addresses Count
    const fetchAddresses = async () => {
      try {
        const q = query(collection(db, "addresses"), where("userId", "==", user.id));
        const snapshot = await getDocs(q);
        setAddressesCount(snapshot.size);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      }
    };

    fetchOrders();
    fetchAddresses();
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          My Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <div className="flex items-center space-x-4 mb-6">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.displayName || "User"}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    {user.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
              </div>

              {/* Edit Profile Button */}
              <Button onClick={() => navigate("/edit-profile")}>
                Edit Profile
              </Button>
            </Card>

            {/* Account Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Account Overview
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    {ordersCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Total Orders
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {user.loyaltyPoints || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Loyalty Points
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    ${user.walletBalance || 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Wallet Balance
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {addressesCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Saved Addresses
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <Link to="/addresses">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    icon={<MapPin className="w-4 h-4" />}
                  >
                    Manage Addresses
                  </Button>
                </Link>
                <Link to="/payment-methods">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    icon={<CreditCard className="w-4 h-4" />}
                  >
                    Payment Methods
                  </Button>
                </Link>
                <Link to="/notifications">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    icon={<Bell className="w-4 h-4" />}
                  >
                    Notifications
                  </Button>
                </Link>
                <Link to="/promotions">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    icon={<Gift className="w-4 h-4" />}
                  >
                    Promotions
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    icon={<Settings className="w-4 h-4" />}
                  >
                    Settings
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Loyalty Program */}
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
              <h3 className="text-lg font-semibold text-orange-600 mb-2">
                Loyalty Rewards
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
                You have {user.loyaltyPoints || 0} points. Earn more by ordering!
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-orange-500 text-orange-500"
              >
                View Rewards
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
