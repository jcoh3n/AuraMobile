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

// Configuration Firebase using v22 modular API
const app = getApp();
export const db = getFirestore(app);
export const firebaseAuth = getAuth(app);

// Types pour les réponses du sondage
export interface SurveyResponse {
  id?: string;
  responses: { [questionId: string]: any };
  timestamp: FirebaseFirestoreTypes.Timestamp;
  completed: boolean;
  ID_questionnaire?: string;
  firebase_timestamp?: string;
  HEURE_DEBUT?: string;
  DATE?: string;
  JOUR?: string;
  HEURE_FIN?: string;
  ENQUETEUR?: string;
}

// Collection Firebase pour les réponses
export const FIREBASE_COLLECTION = 'NEWTEMPLATE';

// Fonction pour sauvegarder une réponse avec les données de l'enquêteur
export const saveSurveyResponse = async (
  responses: { [questionId: string]: any }, 
  enqueteur: string,
  startTime?: Date
): Promise<string> => {
  try {
    const now = new Date();
    const uniqueSurveyInstanceId = `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Structure complète comme dans Vue.js
    const surveyResult = {
      ID_questionnaire: uniqueSurveyInstanceId,
      firebase_timestamp: now.toISOString(),
      HEURE_DEBUT: startTime?.toLocaleTimeString("fr-FR", { 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit" 
      }) || "",
      DATE: now.toLocaleDateString("fr-FR").replace(/\//g, "-"),
      JOUR: [
        "Dimanche", "Lundi", "Mardi", "Mercredi", 
        "Jeudi", "Vendredi", "Samedi"
      ][now.getDay()],
      HEURE_FIN: now.toLocaleTimeString("fr-FR", { 
        hour: "2-digit", 
        minute: "2-digit", 
        second: "2-digit" 
      }),
      ENQUETEUR: enqueteur,
      responses,
      timestamp: serverTimestamp(),
      completed: true,
    };

    const docRef = await addDoc(collection(db, FIREBASE_COLLECTION), surveyResult);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    throw error;
  }
};

// Fonction pour récupérer toutes les réponses (pour l'admin)
export const getAllResponses = async (): Promise<SurveyResponse[]> => {
  try {
    const q = query(collection(db, FIREBASE_COLLECTION), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as SurveyResponse[];
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    throw error;
  }
};

// Authentication functions using modular API
export const signInWithEmail = async (email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    return await signInWithEmailAndPassword(firebaseAuth, email, password);
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await authSignOut(firebaseAuth);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
};

export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return firebaseAuth.currentUser;
};

export const onAuthStateChanged = (callback: (user: FirebaseAuthTypes.User | null) => void) => {
  return authStateChanged(firebaseAuth, callback);
}; 