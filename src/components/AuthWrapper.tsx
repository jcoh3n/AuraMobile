import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { 
  signInWithEmail, 
  onAuthStateChanged 
} from '../config/firebaseConfig';

interface AuthWrapperProps {
  children: React.ReactNode;
  onBack?: () => void;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, onBack }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Récupérer l'email sauvegardé
      try {
        const savedEmail = await AsyncStorage.getItem('adminEmail');
        if (savedEmail) {
          setEmail(savedEmail);
        }
      } catch (error) {
        console.log('Erreur lors de la récupération de l\'email:', error);
      }
    };

    // Initialiser l'auth
    initializeAuth();

    // Écouter les changements d'authentification
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsSigningIn(true);
    try {
      await signInWithEmail(email.trim(), password);
      
      // Sauvegarder l'email si l'utilisateur le souhaite
      if (rememberMe && email.trim()) {
        try {
          await AsyncStorage.setItem('adminEmail', email.trim());
        } catch (error) {
          console.log('Erreur lors de la sauvegarde de l\'email:', error);
        }
      }
      
      setPassword(''); // Ne vider que le mot de passe
    } catch (error: any) {
      let errorMessage = 'Erreur de connexion';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Aucun utilisateur trouvé avec cet email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Mot de passe incorrect';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Adresse email invalide';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Trop de tentatives de connexion. Réessayez plus tard';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Identifiants invalides';
      }
      
      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };



  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loginContainer}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="arrow-back" size={24} color="white" />
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        )}
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Connexion Administrateur</Text>
          <Text style={styles.loginSubtitle}>
            Connectez-vous pour accéder aux résultats du sondage
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Adresse email"
            placeholderTextColor="#8a9bb8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#8a9bb8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          {/* Case à cocher "Se souvenir de moi" */}
          <TouchableOpacity 
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <Icon name="check" size={16} color="white" />}
            </View>
            <Text style={styles.rememberMeText}>Se souvenir de mon email</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.loginButton, isSigningIn && styles.loginButtonDisabled]}
            onPress={handleSignIn}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.helpText}>
            Contactez l'administrateur pour obtenir vos identifiants
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.authenticatedContainer}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a3b63',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a3b63',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  loginCard: {
    backgroundColor: '#3d4f73',
    padding: 30,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#8a9bb8',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#2a3b63',
    borderColor: '#4a90e2',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: 'white',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4a90e2',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#4a90e2',
  },
  rememberMeText: {
    color: '#8a9bb8',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#6b7c93',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    color: '#8a9bb8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  authenticatedContainer: {
    flex: 1,
    backgroundColor: '#2a3b63',
  },
});

export default AuthWrapper;