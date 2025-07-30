import firestore, { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  FirebaseFirestoreTypes 
} from '@react-native-firebase/firestore';

// Configuration Firebase (même que Vue.js)
export const db = getFirestore();

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