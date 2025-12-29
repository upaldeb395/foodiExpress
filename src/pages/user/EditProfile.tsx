// src/pages/user/EditProfile.tsx
import React, { useState } from "react";
import { useAuthStore } from "../../store";
import Button from "../../components/ui/Button";
import { db } from "../../api/firebase";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditProfile: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.displayName || "");
  const [photo, setPhoto] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 🔹 navigation hook

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // 🔹 Firestore update
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, {
        displayName: name,
        photoURL: photo,
        updatedAt: new Date(),
      });

      // 🔹 Zustand store update (real-time UI reflect)
      setUser({
        ...user,
        displayName: name,
        photoURL: photo,
        updatedAt: new Date(),
      });

      toast.success("Profile updated successfully!");

      // 🔹 Redirect to Profile page
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
        </div>

        <div>
          <label className="block mb-1">Photo URL</label>
          <input
            type="text"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
        </div>

        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
