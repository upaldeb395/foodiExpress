// src/pages/user/Promotions.tsx
import React, { useEffect, useState } from "react";
import { db } from "../../api/firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import Button from "../../components/ui/Button";

interface Promo {
  id: string;
  code: string;
  desc: string;
  valid: string;
}

const Promotions: React.FC = () => {
  const [promos, setPromos] = useState<Promo[]>([]);

  // 🔹 Real-time fetch from Firestore
  useEffect(() => {
    const ref = collection(db, "promotions");
    const unsub = onSnapshot(ref, (snapshot) => {
      setPromos(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Promo, "id">),
        }))
      );
    });
    return () => unsub();
  }, []);

  // 🔹 Add dummy promotions (only for testing)
  const addDummyPromos = async () => {
    const ref = collection(db, "promotions");
    const dummyData: Omit<Promo, "id">[] = [
      {
        code: "FOODIE20",
        desc: "20% off on orders above $25",
        valid: "Valid till 30 Sept",
      },
      {
        code: "FREESHIP",
        desc: "Free delivery on first 3 orders",
        valid: "Valid till 15 Oct",
      },
    ];

    for (const promo of dummyData) {
      await addDoc(ref, promo);
    }
  };

  return (
    <div className="p-6 text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Promotions</h1>

      <div className="space-y-4">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 p-4 rounded-lg shadow"
          >
            <p className="font-bold text-orange-600">{promo.code}</p>
            <p className="text-sm">{promo.desc}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{promo.valid}</p>
          </div>
        ))}

        {promos.length === 0 && (
          <Button className="w-full mt-4" onClick={addDummyPromos}>
            Add Dummy Promotions
          </Button>
        )}
      </div>
    </div>
  );
};

export default Promotions;
