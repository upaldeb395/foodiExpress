// src/pages/user/Addresses.tsx
import React, { useEffect, useState } from "react";
import { MapPin, Plus, Edit, Trash } from "lucide-react";
import Button from "../../components/ui/Button";
import { db } from "../../api/firebase"; // তোমার firebase config ফাইল থেকে import করো
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useAuthStore } from "../../store";

interface Address {
  id: string;
  label: string;
  details: string;
  isDefault: boolean;
}

const Addresses: React.FC = () => {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);

  // 🔹 Real-time listener for addresses
  useEffect(() => {
    if (!user) return;
    const ref = collection(db, "users", user.id, "addresses");
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      setAddresses(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Address, "id">),
        }))
      );
    });
    return () => unsubscribe();
  }, [user]);

  // 🔹 Add a new dummy address
  const addAddress = async () => {
    if (!user) return;
    const ref = collection(db, "users", user.id, "addresses");
    await addDoc(ref, {
      label: "New Address",
      details: "Write address here...",
      isDefault: false,
    });
  };

  // 🔹 Delete an address
  const deleteAddress = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.id, "addresses", id));
  };

  // 🔹 Set default address
  const setDefaultAddress = async (id: string) => {
    if (!user) return;
    const ref = collection(db, "users", user.id, "addresses");

    // সবগুলো address এর isDefault = false করবো
    addresses.forEach(async (addr) => {
      await updateDoc(doc(ref, addr.id), { isDefault: addr.id === id });
    });
  };

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Manage Addresses</h1>

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div>
              <p className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                {addr.label}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {addr.details}
              </p>
              {addr.isDefault && (
                <span className="text-xs text-green-500 font-medium">
                  Default
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                icon={<Edit className="w-4 h-4" />}
                onClick={() => setDefaultAddress(addr.id)}
              >
                Set Default
              </Button>
              <Button
                size="sm"
                variant="outline"
                icon={<Trash className="w-4 h-4" />}
                onClick={() => deleteAddress(addr.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}

        <Button
          icon={<Plus className="w-4 h-4" />}
          className="w-full"
          onClick={addAddress}
        >
          Add New Address
        </Button>
      </div>
    </div>
  );
};

export default Addresses;
