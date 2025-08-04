import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { surveyQuestions, surveyConfig } from '../data/surveyQuestions';
import OfflineManager from '../services/OfflineManager';
import OfflineStatusBar from './OfflineStatusBar';
import GlobalContainer from './GlobalContainer';
import { SurveyQuestion, SurveyAnswers, SurveyNavigation } from '../types/survey';
import SingleChoiceQuestion from './SingleChoiceQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TextInputQuestion from './TextInputQuestion';
import GareQuestion from './GareQuestion';
import CommuneQuestion from './CommuneQuestion';
import StreetQuestion from './StreetQuestion';
import StationQuestion from './StationQuestion';

interface SurveyProps {
  onComplete?: () => void;
}

// Clé pour AsyncStorage
const ENQUETEUR_STORAGE_KEY = '@surveyor_name';

const Survey: React.FC<SurveyProps> = ({ onComplete }) => {
  // État du sondage équivalent au Vue.js
  const [currentStep, setCurrentStep] = useState<'enqueteur' | 'welcome' | 'survey'>('enqueteur');
  const [enqueteurInput, setEnqueteurInput] = useState('');
  const [savedEnqueteur, setSavedEnqueteur] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);

  const [navigation, setNavigation] = useState<SurveyNavigation>({
    currentQuestionId: surveyConfig.startQuestionId,
    history: [],
    answers: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingName, setIsLoadingName] = useState(true);

  // Fonction pour déterminer le texte conditionnel d'une question
  const getConditionalText = (question: SurveyQuestion, answers: SurveyAnswers): string => {
    if (!question.conditionalText) {
      return question.text;
    }

    const { condition, routes } = question.conditionalText;
    const conditionValue = answers[condition];
    
    const matchingRoute = routes.find(route => route.value === conditionValue);
    return matchingRoute?.text || question.text;
  };

  // Trouver la question actuelle
  const currentQuestion = useMemo(() => {
    const question = surveyQuestions.find(q => q.id === navigation.currentQuestionId);
    if (!question) return null;

    // Appliquer le texte conditionnel si nécessaire
    const questionWithConditionalText = {
      ...question,
      text: getConditionalText(question, navigation.answers)
    };

    return questionWithConditionalText;
  }, [navigation.currentQuestionId, navigation.answers]);

  // Fonctions AsyncStorage pour la persistance du nom d'enquêteur
  const loadSavedEnqueteur = async () => {
    try {
      const savedName = await AsyncStorage.getItem(ENQUETEUR_STORAGE_KEY);
      if (savedName) {
        setSavedEnqueteur(savedName);
        setEnqueteurInput(savedName);
        setCurrentStep('welcome'); // Aller directement à l'écran de bienvenue
      }
    } catch (error) {
      console.error('Erreur lors du chargement du nom d\'enquêteur:', error);
    } finally {
      setIsLoadingName(false);
    }
  };

  const saveEnqueteurToStorage = async (name: string) => {
    try {
      await AsyncStorage.setItem(ENQUETEUR_STORAGE_KEY, name);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du nom d\'enquêteur:', error);
    }
  };

  // Charger le nom sauvegardé au démarrage
  useEffect(() => {
    loadSavedEnqueteur();
  }, []);

  // Fonction utilitaire pour évaluer les conditions
  const evaluateCondition = (condition: string, answers: SurveyAnswers): boolean => {
    try {
      // Parser et évaluer les conditions de manière sécurisée
      const parts = condition.split(/\s+(AND|OR)\s+/);
      
      let result = evaluateSimpleCondition(parts[0].trim(), answers);
      
      for (let i = 1; i < parts.length; i += 2) {
        const operator = parts[i];
        const nextCondition = parts[i + 1];
        const nextResult = evaluateSimpleCondition(nextCondition.trim(), answers);
        
        if (operator === 'AND') {
          result = result && nextResult;
        } else if (operator === 'OR') {
          result = result || nextResult;
        }
      }
      
      return result;
    } catch (error) {
      console.warn('Erreur lors de l\'évaluation de la condition:', condition, error);
      return false;
    }
  };

  // Évaluer une condition simple (ex: "Q1 == 1" ou "Q20" pour vérifier l'existence)
  const evaluateSimpleCondition = (condition: string, answers: SurveyAnswers): boolean => {
    // D'abord vérifier si c'est juste un ID de question (ex: "Q20")
    if (condition.match(/^Q\d+[A-Z_]*$/)) {
      const answerValue = answers[condition];
      // Retourner true si la réponse existe et n'est pas vide
      return answerValue !== undefined && answerValue !== null && answerValue !== '';
    }
    
    // Sinon, traiter comme une comparaison normale
    const match = condition.match(/(\w+)\s*(==|!=|>=|<=|>|<)\s*(.+)/);
    if (!match) return false;
    
    const [, questionId, operator, valueStr] = match;
    const answerValue = answers[questionId];
    
    let compareValue: any = valueStr.trim();
    if (compareValue.startsWith('"') && compareValue.endsWith('"')) {
      compareValue = compareValue.slice(1, -1);
    } else if (!isNaN(Number(compareValue))) {
      compareValue = Number(compareValue);
    }
    
    switch (operator) {
      case '==': return answerValue === compareValue;
      case '!=': return answerValue !== compareValue;
      case '>=': return Number(answerValue) >= Number(compareValue);
      case '<=': return Number(answerValue) <= Number(compareValue);
      case '>': return Number(answerValue) > Number(compareValue);
      case '<': return Number(answerValue) < Number(compareValue);
      default: return false;
    }
  };

  // Fonction pour trouver la prochaine question valide (en vérifiant les conditions)
  const findValidNextQuestion = (questionId: string, answers: SurveyAnswers): string | null => {
    const question = surveyQuestions.find(q => q.id === questionId);
    
    if (!question) {
      return null;
    }

    // Si la question a une condition, vérifier si elle est remplie
    if (question.condition && !evaluateCondition(question.condition, answers)) {
      // Si la condition n'est pas remplie, passer à la question suivante
      const nextId = question.fallbackNext || question.next;
      if (nextId && nextId !== 'end') {
        return findValidNextQuestion(nextId, answers);
      }
      return null;
    }

    return questionId;
  };

  // Gérer la réponse à une question
  const handleAnswer = async (answer: any, selectedOptionsData?: any[]) => {
    const newAnswers = {
      ...navigation.answers,
      [navigation.currentQuestionId]: answer
    };

    // Déterminer la prochaine question avec logique conditionnelle avancée
    let nextQuestionId: string | undefined;

    // 1. Vérifier next_if_selected pour multipleChoice
    if (currentQuestion?.type === 'multipleChoice' && selectedOptionsData) {
      const optionWithNext = selectedOptionsData.find(opt => opt.next_if_selected);
      if (optionWithNext) {
        nextQuestionId = optionWithNext.next_if_selected;
      }
    }

    // 2. Navigation conditionnelle pour singleChoice
    if (!nextQuestionId && currentQuestion?.type === 'singleChoice') {
      const selectedOption = currentQuestion.options?.find(opt => opt.id === answer);
      
      // Vérifier next_if_selected d'abord
      if (selectedOption?.next_if_selected) {
        nextQuestionId = selectedOption.next_if_selected;
      } else {
        nextQuestionId = selectedOption?.next;
      }
    }

    // 3. Logique conditionnelle avancée (conditionalNext)
    if (!nextQuestionId && currentQuestion?.conditionalNext) {
      for (const conditionalLogic of currentQuestion.conditionalNext) {
        const conditionValue = newAnswers[conditionalLogic.condition];
        const matchingRoute = conditionalLogic.routes.find(route => route.value === conditionValue);
        if (matchingRoute?.next) {
          nextQuestionId = matchingRoute.next;
          break;
        }
      }
    }

    // 4. Navigation par défaut
    if (!nextQuestionId) {
      nextQuestionId = currentQuestion?.next || currentQuestion?.fallbackNext;
    }

    // Si c'est la fin du sondage
    if (nextQuestionId === 'end' || !nextQuestionId) {
      await handleSurveyComplete(newAnswers);
      return;
    }

    // Vérifier si la prochaine question doit être affichée (conditions)
    const finalNextQuestionId = findValidNextQuestion(nextQuestionId, newAnswers);
    
    if (finalNextQuestionId === 'end' || !finalNextQuestionId) {
      await handleSurveyComplete(newAnswers);
      return;
    }

    // Navigation vers la question suivante
    setNavigation({
      currentQuestionId: finalNextQuestionId,
      history: [...navigation.history, navigation.currentQuestionId],
      answers: newAnswers
    });
  };

  // Fonction pour définir l'enquêteur (équivalent Vue.js)
  const setEnqueteur = async () => {
    if (enqueteurInput.trim() !== "") {
      const trimmedName = enqueteurInput.trim();
      setSavedEnqueteur(trimmedName);
      await saveEnqueteurToStorage(trimmedName); // Sauvegarder dans AsyncStorage
      setCurrentStep('welcome');
      // Pas de capture du temps ici - sera fait au début du sondage
    } else {
      Alert.alert("Erreur", "Veuillez entrer le prénom de l'enquêteur.");
    }
  };

  // Fonction pour changer/éditer le nom d'enquêteur
  const changeEnqueteur = () => {
    setCurrentStep('enqueteur');
    setEnqueteurInput(savedEnqueteur); // Pré-remplir avec le nom actuel
    // Note: on préserve startTime - pas de reset du temps de début
  };

  // Fonction pour effacer complètement le nom sauvegardé (utile pour debug/admin)
  const clearSavedEnqueteur = async () => {
    try {
      await AsyncStorage.removeItem(ENQUETEUR_STORAGE_KEY);
      setSavedEnqueteur('');
      setEnqueteurInput('');
      setCurrentStep('enqueteur');
    } catch (error) {
      console.error('Erreur lors de la suppression du nom d\'enquêteur:', error);
    }
  };

  // Finaliser le sondage
  const handleSurveyComplete = async (finalAnswers: SurveyAnswers) => {
    setIsSubmitting(true);
    try {
      // Capture de l'enquêteur pour éviter la perte lors des opérations async
      const capturedEnqueteur = savedEnqueteur;
      
      // Utiliser OfflineManager au lieu de saveSurveyResponse directement
      const offlineManager = OfflineManager.getInstance();
      const result = await offlineManager.saveSurvey(
        finalAnswers, 
        capturedEnqueteur, 
        startTime || undefined
      );
      
      console.log('[Survey] ⚠️ RESULTAT REÇU:', result);
      console.log('[Survey] success:', result.success, 'savedOffline:', result.savedOffline);
      
      if (result.success) {
        const title = result.savedOffline ? 'Sondage sauvegardé !' : 'Merci !';
        const message = result.savedOffline 
          ? 'Votre sondage a été sauvegardé localement et sera synchronisé dès que la connexion sera rétablie.'
          : 'Votre participation au sondage a été enregistrée avec succès.';

        console.log('[Survey] ⚠️ AFFICHAGE POPUP:', { title, message });

        Alert.alert(
          title,
          message,
          [
            {
              text: 'OK',
              onPress: () => onComplete?.()
            }
          ]
        );
      } else {
        // Erreur de sauvegarde
        Alert.alert(
          'Erreur',
          result.message || 'Une erreur est survenue lors de l\'enregistrement.',
          [
            {
              text: 'Réessayer',
              onPress: () => handleSurveyComplete(finalAnswers)
            },
            {
              text: 'Annuler',
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.error('Erreur lors de la finalisation du sondage:', error);
      Alert.alert(
        'Erreur',
        'Une erreur inattendue est survenue. Veuillez réessayer.',
        [
          {
            text: 'Réessayer',
            onPress: () => handleSurveyComplete(finalAnswers)
          },
          {
            text: 'Annuler',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Revenir à la question précédente
  const handleGoBack = () => {
    if (navigation.history.length > 0) {
      const previousQuestionId = navigation.history[navigation.history.length - 1];
      const newHistory = navigation.history.slice(0, -1);
      
      setNavigation({
        ...navigation,
        currentQuestionId: previousQuestionId,
        history: newHistory
      });
    }
  };

  // Fonction pour gérer le bouton retour (accueil ou question précédente)
  const handleBackButton = () => {
    if (navigation.history.length === 0) {
      // Si on est sur la première question, retourner à l'écran de bienvenue
      setCurrentStep('welcome');
    } else {
      // Sinon, revenir à la question précédente
      handleGoBack();
    }
  };

  // Commencer le sondage (depuis l'écran de bienvenue)
  const startSurvey = () => {
    setStartTime(new Date()); // Capture du temps de début au moment où le sondage commence vraiment
    setCurrentStep('survey');
  };

  // Écran de chargement au démarrage
  if (isLoadingName) {
    return (
      <GlobalContainer>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </GlobalContainer>
    );
  }

  // Écran de saisie de l'enquêteur (équivalent Vue.js)
  if (currentStep === 'enqueteur') {
    return (
      <GlobalContainer>
        <OfflineStatusBar />
        <ScrollView contentContainerStyle={styles.welcomeContainer}>
          <Text style={styles.title}>Sondage Mobilité Gare d'Auray</Text>
          <Text style={styles.enqueteurLabel}>
            {savedEnqueteur ? 'Modifier le prénom enquêteur :' : 'Prénom enquêteur :'}
          </Text>
          <TextInput
            style={styles.enqueteurInput}
            value={enqueteurInput}
            onChangeText={setEnqueteurInput}
            placeholder="Entrez votre prénom"
            placeholderTextColor="#8a9bb8"
            autoCapitalize="words"
          />
          {enqueteurInput.trim() && (
            <TouchableOpacity style={styles.nextButton} onPress={setEnqueteur}>
              <Text style={styles.nextButtonText}>
                {savedEnqueteur ? 'Mettre à jour' : 'Suivant'}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </GlobalContainer>
    );
  }

  // Écran de bienvenue
  if (currentStep === 'welcome') {
    return (
      <GlobalContainer>
        <OfflineStatusBar />
        <ScrollView contentContainerStyle={styles.welcomeContainer}>
          <Text style={styles.title}>{surveyConfig.title}</Text>
          
          {/* Affichage du nom d'enquêteur avec possibilité de changement */}
          <View style={styles.enqueteurDisplay}>
            <Text style={styles.enqueteurDisplayLabel}>Enquêteur :</Text>
            <Text style={styles.enqueteurDisplayName}>{savedEnqueteur}</Text>
            <TouchableOpacity 
              style={styles.changeNameButton} 
              onPress={changeEnqueteur}
              onLongPress={() => {
                Alert.alert(
                  "Effacer le nom sauvegardé",
                  "Voulez-vous complètement effacer le nom d'enquêteur sauvegardé ?",
                  [
                    { text: "Annuler", style: "cancel" },
                    { text: "Effacer", style: "destructive", onPress: clearSavedEnqueteur }
                  ]
                );
              }}
            >
              <Text style={styles.changeNameButtonText}>Changer</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.welcomeText}>{surveyConfig.welcomeMessage}</Text>
          <TouchableOpacity style={styles.startButton} onPress={startSurvey}>
            <Text style={styles.startButtonText}>Commencer le sondage</Text>
          </TouchableOpacity>
        </ScrollView>
      </GlobalContainer>
    );
  }

  // Écran de chargement
  if (isSubmitting) {
    return (
      <GlobalContainer>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Enregistrement en cours...</Text>
        </View>
      </GlobalContainer>
    );
  }

  // Erreur : question non trouvée
  if (!currentQuestion) {
    return (
      <GlobalContainer>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur : Question non trouvée</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </GlobalContainer>
    );
  }

  return (
    <GlobalContainer>
      <OfflineStatusBar />
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackButton}>
          <Text style={styles.backButtonText}>
            {navigation.history.length === 0 ? '← Accueil' : '← Retour'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>
          Question {navigation.history.length + 1}
        </Text>
      </View>

      {/* Contenu de la question */}
      <View style={styles.questionContainer}>
        {currentQuestion.type === 'singleChoice' ? (
          <SingleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedValue={navigation.answers[currentQuestion.id]}
          />
        ) : currentQuestion.type === 'multipleChoice' ? (
          <MultipleChoiceQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            selectedValues={navigation.answers[currentQuestion.id] || []}
          />
        ) : currentQuestion.type === 'gare' ? (
          <GareQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            initialValue={navigation.answers[currentQuestion.id] || ''}
          />
        ) : currentQuestion.type === 'station' ? (
          <StationQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            initialValue={navigation.answers[currentQuestion.id] || ''}
          />
        ) : currentQuestion.type === 'commune' ? (
          <CommuneQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            initialValue={navigation.answers[currentQuestion.id] || ''}
          />
        ) : currentQuestion.type === 'street' ? (
          <StreetQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            initialValue={navigation.answers[currentQuestion.id] || ''}
          />
        ) : (
          <TextInputQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            initialValue={navigation.answers[currentQuestion.id] || ''}
          />
        )}
      </View>
    </GlobalContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a3b63',
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  enqueteurLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  enqueteurInput: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
    color: '#2a3b63',
  },
  nextButton: {
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  enqueteurDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3d4f73',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  enqueteurDisplayLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  enqueteurDisplayName: {
    color: '#4a90e2',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  changeNameButton: {
    backgroundColor: '#666',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 8,
  },
  changeNameButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  backButton: {
    backgroundColor: '#3d4f73',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  backButtonText: {
    color: 'white',
    fontSize: 14,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Survey; 