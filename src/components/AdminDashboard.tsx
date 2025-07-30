import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator, 
  Modal, 
  ScrollView,
  Dimensions
} from 'react-native';
import { getAllResponses, SurveyResponse } from '../config/firebaseConfig';

interface AdminDashboardProps {
  onClose?: () => void;
}

interface SurveysByEnqueteur {
  [key: string]: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [password, setPassword] = useState('');
  const [surveysByEnqueteur, setSurveysByEnqueteur] = useState<SurveysByEnqueteur>({});
  const [totalSurveys, setTotalSurveys] = useState(0);
  const [loading, setLoading] = useState(false);

  const signIn = () => {
    if (password === 'admin123') {
      setShowSignInModal(false);
      fetchAdminData();
      setShowAdminDashboard(true);
      setPassword(''); // Clear password
    } else {
      Alert.alert('Erreur', 'Mot de passe incorrect');
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const responses = await getAllResponses();
      setTotalSurveys(responses.length);

      // Calculate surveys by enquêteur
      const surveyCount: SurveysByEnqueteur = {};
      responses.forEach((response) => {
        // Look for ENQUETEUR field in responses or use a default
        const enqueteur = response.responses?.ENQUETEUR || 'Non spécifié';
        surveyCount[enqueteur] = (surveyCount[enqueteur] || 0) + 1;
      });
      
      setSurveysByEnqueteur(surveyCount);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const downloadData = async () => {
    try {
      Alert.alert(
        'Téléchargement', 
        'La fonctionnalité de téléchargement sera bientôt disponible sur mobile',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error downloading data:', error);
      Alert.alert('Erreur', 'Erreur lors du téléchargement');
    }
  };

  // Sign In Modal Component
  const renderSignInModal = () => (
    <Modal
      visible={showSignInModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSignInModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.signinModal]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSignInModal(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Connexion Admin</Text>
          
          <TextInput
            style={styles.formControl}
            value={password}
            onChangeText={setPassword}
            placeholder="Entrez le mot de passe"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            secureTextEntry
          />
          
          <TouchableOpacity style={styles.btnSignin} onPress={signIn}>
            <Text style={styles.btnSigninText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Admin Dashboard Modal Component
  const renderAdminDashboardModal = () => (
    <Modal
      visible={showAdminDashboard}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowAdminDashboard(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, styles.adminDashboardModal]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowAdminDashboard(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Tableau de Bord Admin</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#68d391" />
            </View>
          ) : (
            <ScrollView style={styles.dashboardContent}>
              {/* Total Surveys Card */}
              <View style={[styles.dashboardCard, styles.totalCard]}>
                <Text style={styles.cardTitle}>Total des Enquêtes</Text>
                <Text style={styles.bigNumber}>{totalSurveys}</Text>
              </View>

              {/* Surveys by Enquêteur Card */}
              <View style={styles.dashboardCard}>
                <Text style={styles.cardTitle}>Enquêtes par Enquêteur</Text>
                <ScrollView style={styles.enqueteurList} nestedScrollEnabled>
                  {Object.entries(surveysByEnqueteur).map(([name, count]) => (
                    <View key={name} style={styles.listItem}>
                      <Text style={styles.enqueteurName}>{name}</Text>
                      <Text style={styles.count}>{count}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
          )}
          
          <TouchableOpacity style={styles.btnDownload} onPress={downloadData}>
            <Text style={styles.btnDownloadText}>Télécharger les Données</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Main Sign In Button */}
      <TouchableOpacity
        style={styles.mainSigninButton}
        onPress={() => setShowSignInModal(true)}
      >
        <Text style={styles.mainSigninButtonText}>Connexion Admin</Text>
      </TouchableOpacity>

      {/* Close Button if onClose is provided */}
      {onClose && (
        <TouchableOpacity style={styles.closeMainButton} onPress={onClose}>
          <Text style={styles.closeMainButtonText}>Fermer</Text>
        </TouchableOpacity>
      )}

      {/* Modals */}
      {renderSignInModal()}
      {renderAdminDashboardModal()}
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a3b63',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainSigninButton: {
    backgroundColor: 'rgba(45, 55, 72, 0.4)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  mainSigninButtonText: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '400',
    textTransform: 'lowercase',
    letterSpacing: 1,
  },
  closeMainButton: {
    backgroundColor: '#666',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  closeMainButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2d3748',
    padding: 25,
    borderRadius: 15,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  signinModal: {
    width: Math.min(320, screenWidth * 0.9),
    padding: 15,
  },
  adminDashboardModal: {
    width: Math.min(350, screenWidth * 0.9),
    maxHeight: '80%',
    padding: 15,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'normal',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  formControl: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: 12,
    fontSize: 14,
    borderRadius: 8,
    marginBottom: 15,
    height: 48,
  },
  btnSignin: {
    backgroundColor: '#68d391',
    padding: 12,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#68d391',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  btnSigninText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dashboardContent: {
    maxHeight: 300,
    marginBottom: 8,
  },
  dashboardCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  totalCard: {
    alignItems: 'center',
    padding: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: 'normal',
    marginBottom: 4,
  },
  bigNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#68d391',
    margin: 2,
  },
  enqueteurList: {
    maxHeight: 150,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  enqueteurName: {
    color: 'white',
    fontSize: 14,
    flex: 1,
  },
  count: {
    color: '#68d391',
    fontSize: 14,
    fontWeight: 'normal',
  },
  btnDownload: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDownloadText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminDashboard; 