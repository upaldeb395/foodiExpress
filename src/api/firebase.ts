// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, limit, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration - replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyCObNKPI-0L55zUPd2QvIpfIuoWdxwmBAc",
  authDomain: "foodieexpress-49411.firebaseapp.com",
  projectId: "foodieexpress-49411",
  storageBucket: "foodieexpress-49411.firebasestorage.app",
  messagingSenderId: "479411155616",
  appId: "1:479411155616:web:a68337c5b3069de1378fc5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

// Authentication providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Authentication functions
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithFacebook = () => signInWithPopup(auth, facebookProvider);
export const signInWithEmail = (email: string, password: string) => 
  signInWithEmailAndPassword(auth, email, password);
export const signUpWithEmail = (email: string, password: string) => 
  createUserWithEmailAndPassword(auth, email, password);
export const signOutUser = () => signOut(auth);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

// Firestore helper functions
export const createDocument = async (collectionName: string, docId: string, data: any) => {
  const docRef = doc(db, collectionName, docId);
  await setDoc(docRef, {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef;
};

export const getDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, {
    ...data,
    updatedAt: new Date()
  });
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  await deleteDoc(docRef);
};

export const getCollection = async (collectionName: string, conditions?: any[]) => {
  const collectionRef = collection(db, collectionName);
  let q = query(collectionRef);
  
  if (conditions) {
    conditions.forEach(condition => {
      q = query(q, condition);
    });
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToCollection = (
  collectionName: string,
  callback: (data: any[]) => void,
  conditions?: any[]
) => {
  const collectionRef = collection(db, collectionName);
  let q = query(collectionRef);
  
  if (conditions) {
    conditions.forEach(condition => {
      q = query(q, condition);
    });
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

export const subscribeToDocument = (
  collectionName: string,
  docId: string,
  callback: (data: any) => void
) => {
  const docRef = doc(db, collectionName, docId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });
};

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// Push notification functions
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'your-vapid-key' // Replace with your VAPID key
      });
      return token;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
  }
  return null;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

// Collection references for type safety
export const collections = {
  users: 'users',
  restaurants: 'restaurants',
  menuItems: 'menuItems',
  orders: 'orders',
  reviews: 'reviews',
  notifications: 'notifications',
  promoCodes: 'promoCodes',
  deliveryPartners: 'deliveryPartners',
  addresses: 'addresses'
} as const;

export default app;