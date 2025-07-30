import firestore from '@react-native-firebase/firestore';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Configuration Firebase (même que Vue.js)
export const db = firestore();

// Types pour les réponses du sondage
export interface SurveyResponse {
  id?: string;
  responses: { [questionId: string]: any };
  timestamp: FirebaseFirestoreTypes.Timestamp;
  completed: boolean;
}

// Collection Firebase pour les réponses
export const FIREBASE_COLLECTION = 'NEWTEMPLATE';

// Fonction pour sauvegarder une réponse
export const saveSurveyResponse = async (responses: { [questionId: string]: any }): Promise<string> => {
  try {
    const docRef = await db.collection(FIREBASE_COLLECTION).add({
      responses,
      timestamp: firestore.FieldValue.serverTimestamp(),
      completed: true,
    });
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    throw error;
  }
};

// Fonction pour récupérer toutes les réponses (pour l'admin)
export const getAllResponses = async (): Promise<SurveyResponse[]> => {
  try {
    const snapshot = await db.collection(FIREBASE_COLLECTION).orderBy('timestamp', 'desc').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as SurveyResponse[];
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    throw error;
  }
}; 