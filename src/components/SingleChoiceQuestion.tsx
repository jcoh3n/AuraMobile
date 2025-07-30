import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Modal, ScrollView } from 'react-native';
import { SurveyQuestion, SurveyOption } from '../types/survey';
import { questionImages } from '../data/surveyQuestions';

interface SingleChoiceQuestionProps {
  question: SurveyQuestion;
  onAnswer: (optionId: number) => void;
  selectedValue?: number;
}

const { width: screenWidth } = Dimensions.get('window');

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
  question,
  onAnswer,
  selectedValue
}) => {
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const getImageSource = (imagePath: string) => {
    // Pour React Native, nous devons require les images statiquement
    // Mapping des chemins d'images vers les require() correspondants
    const imageMap: { [key: string]: any } = {
      '/plan.png': require('../assets/images/plan.png'),
      'plan.png': require('../assets/images/plan.png'),
      // Ajouter facilement d'autres images ici :
      // '/gare_overview.png': require('../assets/images/gare_overview.png'),
      // '/destinations_map.png': require('../assets/images/destinations_map.png'),
    };
    
    return imageMap[imagePath] || null;
  };

  // Récupérer la configuration d'image pour cette question
  const imageConfig = questionImages[question.id as keyof typeof questionImages];

  const openImageModal = () => {
    setIsImageModalVisible(true);
  };

  const closeImageModal = () => {
    setIsImageModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        <Text style={styles.questionText}>{question.text}</Text>
        
        {imageConfig && (
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={openImageModal} activeOpacity={0.8}>
              <Image
                source={getImageSource(imageConfig.image)}
                style={styles.questionImage}
                resizeMode="contain"
                accessibilityLabel={imageConfig.imageAlt}
              />
              <View style={styles.zoomHint}>
                <Text style={styles.zoomHintText}>🔍 Appuyez pour agrandir</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.optionsContainer}>
          {question.options?.map((option: SurveyOption) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionButton,
                selectedValue === option.id && styles.selectedOption
              ]}
              onPress={() => onAnswer(option.id)}
            >
              <Text style={[
                styles.optionText,
                selectedValue === option.id && styles.selectedOptionText
              ]}>
                {option.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Modal pour l'affichage en zoom de l'image */}
      <Modal
        visible={isImageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackground} 
            onPress={closeImageModal}
            activeOpacity={1}
          >
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              minimumZoomScale={1}
              maximumZoomScale={3}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              <Image
                source={getImageSource(imageConfig?.image || '')}
                style={styles.modalImage}
                resizeMode="contain"
              />
            </ScrollView>
            
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={closeImageModal}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalFooter}>
              <Text style={styles.modalImageDescription}>
                {imageConfig?.imageAlt}
              </Text>
              <Text style={styles.modalZoomHint}>
                Pincez pour zoomer • Appuyez pour fermer
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a3b63',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40, // Espace supplémentaire en bas pour éviter que le dernier élément soit coupé
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  questionImage: {
    width: screenWidth - 40,
    height: 220,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  zoomHint: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  zoomHintText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
  },
  optionsContainer: {
    // Supprimer flex: 1 car maintenant c'est dans un ScrollView
  },
  optionButton: {
    backgroundColor: '#3d4f73',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3d4f73',
  },
  selectedOption: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  selectedOptionText: {
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalScrollContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 100,
  },
  modalImage: {
    width: screenWidth - 40,
    height: '100%',
    maxHeight: 600,
  },
  modalHeader: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalFooter: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 15,
  },
  modalImageDescription: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  modalZoomHint: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default SingleChoiceQuestion; 