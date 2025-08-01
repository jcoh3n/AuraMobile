// Example: Using environment variables (optional)
import { 
  getFirestore,
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  FirebaseFirestoreTypes 
} from '@react-native-firebase/firestore';
import { 
  getAuth,
  signInWithEmailAndPassword,
  signOut as authSignOut,
  onAuthStateChanged as authStateChanged,
  FirebaseAuthTypes 
} from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';
import Config from 'react-native-config';

// Configuration using environment variables (if preferred)
const app = getApp();
export const db = getFirestore(app);
export const firebaseAuth = getAuth(app);

// You could also validate environment variables
if (!Config.FIREBASE_PROJECT_ID) {
  throw new Error('FIREBASE_PROJECT_ID is required in .env file');
}

// Rest of your Firebase functions remain the same...
export const signInWithEmail = async (email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    return await signInWithEmailAndPassword(firebaseAuth, email, password);
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

// ... other functions ...