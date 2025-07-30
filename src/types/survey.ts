// Types pour les questions du sondage
export interface SurveyOption {
  id: number;
  text: string;
  next?: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'singleChoice' | 'multipleChoice' | 'commune' | 'street' | 'gare' | 'text' | 'number';
  options?: SurveyOption[];
  next?: string;
  required?: boolean;
}

// Type pour la configuration des images des questions
export interface QuestionImage {
  image: string;
  imageAlt: string;
}

export interface QuestionImagesConfig {
  [questionId: string]: QuestionImage;
}

// Types pour les réponses
export interface SurveyAnswers {
  [questionId: string]: any;
}

// Types pour la navigation du sondage
export interface SurveyNavigation {
  currentQuestionId: string;
  history: string[];
  answers: SurveyAnswers;
}

// Interface pour les données du sondage incluant l'enquêteur
export interface SurveyData {
  ID_questionnaire?: string;
  firebase_timestamp?: string;
  HEURE_DEBUT?: string;
  DATE?: string;
  JOUR?: string;
  HEURE_FIN?: string;
  ENQUETEUR: string;
  responses: SurveyAnswers;
}

// Types pour les données de référence
export interface Street {
  name: string;
  commune?: string;
}

export interface Commune {
  name: string;
  code?: string;
}

export interface Station {
  name: string;
  line?: string;
} 