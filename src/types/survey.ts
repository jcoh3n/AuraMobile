// Types pour les questions du sondage
export interface SurveyOption {
  id: number;
  text: string;
  next?: string;
  next_if_selected?: string; // Navigation vers une question de précision si cette option est sélectionnée
}

// Interface pour les conditions
export interface ConditionalRoute {
  value: number | string;
  next?: string;
  text?: string;
}

export interface ConditionalLogic {
  condition: string;
  routes: ConditionalRoute[];
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'singleChoice' | 'multipleChoice' | 'commune' | 'street' | 'gare' | 'station' | 'text' | 'number';
  options?: SurveyOption[];
  next?: string;
  required?: boolean;
  
  // Fonctionnalités avancées
  condition?: string; // Condition pour afficher cette question
  conditionalText?: ConditionalLogic; // Texte conditionnel basé sur les réponses précédentes
  conditionalNext?: ConditionalLogic[]; // Navigation conditionnelle
  fallbackNext?: string; // Navigation par défaut si les conditions ne sont pas remplies
  
  // Pour les questions de texte libre
  freeTextPlaceholder?: string; // Placeholder pour les champs de texte
  validation?: 'numeric' | 'email' | string; // Type de validation
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