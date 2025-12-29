// src/pages/user/PaymentMethods.tsx
import React, { useEffect, useState } from "react";
import { CreditCard, Smartphone, DollarSign } from "lucide-react";
import Button from "../../components/ui/Button";
import { db } from "../../api/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { useAuthStore } from "../../store";

interface PaymentMethod {
  id: string;
  name: string;
  details: string;
  type: "bkash" | "bank" | "cod";
}

const PaymentMethods: React.FC = () => {
  const { user } = useAuthStore();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  // 🔹 Real-time fetch from Firestore
  useEffect(() => {
    if (!user) return;
    const ref = collection(db, "users", user.id, "paymentMethods");
    const unsub = onSnapshot(ref, (snapshot) => {
      setMethods(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<PaymentMethod, "id">),
        }))
      );
    });
    return () => unsub();
  }, [user]);

  // 🔹 Add dummy payment methods (bkash, bank, cod)
  const addDummyMethods = async () => {
    if (!user) return;
    const ref = collection(db, "users", user.id, "paymentMethods");

    const dummyData: Omit<PaymentMethod, "id">[] = [
      { name: "bKash", details: "017XXXXXXXX", type: "bkash" },
      { name: "Bank Transfer", details: "A/C: 1234567890, DBBL", type: "bank" },
      { name: "Cash on Delivery (COD)", details: "Pay when you receive", type: "cod" },
    ];

    for (const method of dummyData) {
      await addDoc(ref, method);
    }
  };

  // 🔹 Delete method
  const deleteMethod = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "users", user.id, "paymentMethods", id));
  };

  // 🔹 Choose icon based on type
  const getIcon = (type: string) => {
    switch (type) {
      case "bkash":
        return <Smartphone className="w-5 h-5 text-pink-500" />;
      case "bank":
        return <CreditCard className="w-5 h-5 text-blue-500" />;
      case "cod":
        return <DollarSign className="w-5 h-5 text-green-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Payment Methods</h1>

      <div className="space-y-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
          >
            <div className="flex items-center gap-3">
              {getIcon(method.type)}
              <div>
                <p className="font-semibold">{method.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {method.details}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => deleteMethod(method.id)}
            >
              Delete
            </Button>
          </div>
        ))}

        {methods.length === 0 && (
          <Button className="w-full mt-4" onClick={addDummyMethods}>
            Add Dummy Payment Methods
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
