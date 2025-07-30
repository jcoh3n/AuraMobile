/**
 * Auray Mobility Survey - React Native App
 * Application de sondage de mobilité ferroviaire
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import Survey from './src/components/Survey';
import AdminDashboard from './src/components/AdminDashboard';

type AppMode = 'survey' | 'admin' | 'home';

function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('home');

  const renderContent = () => {
    switch (currentMode) {
      case 'survey':
        return (
          <Survey 
            onComplete={() => setCurrentMode('home')}
          />
        );
      
      case 'admin':
        return (
          <AdminDashboard 
            onClose={() => setCurrentMode('home')}
          />
        );
      
      default:
        return (
          <View style={styles.homeContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🚄</Text>
              <Text style={styles.appTitle}>Sondage Mobilité</Text>
              <Text style={styles.appSubtitle}>Gare d'Auray</Text>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setCurrentMode('survey')}
              >
                <Text style={styles.primaryButtonText}>
                  Participer au sondage
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setCurrentMode('admin')}
              >
                <Text style={styles.secondaryButtonText}>
                  Interface d'administration
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Ville d'Auray • AQTA • Région Bretagne • SNCF
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2a3b63" />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a3b63',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 64,
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 20,
    color: '#8a9bb8',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonsContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#4a90e2',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#8a9bb8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#8a9bb8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default App;
