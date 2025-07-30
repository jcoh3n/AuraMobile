# 🚄 Auray Mobilité - Application Android

Application React Native de sondage de mobilité ferroviaire pour la gare d'Auray.

## 📱 Applications générées

### APK disponibles :
- **`AurayMobilite-Release.apk`** (49 MB) - Version optimisée pour la distribution
- **`AurayMobilite-Debug.apk`** (103 MB) - Version de développement avec outils de debug

## 🎯 Fonctionnalités

### ✅ **Sondage interactif**
- Questions conditionnelles avec logique de navigation
- Interface intuitive adaptée mobile
- Validation des réponses en temps réel
- Sauvegarde automatique dans Firebase

### ✅ **Types de questions supportées**
- **Choix unique** : Questions à options multiples
- **Saisie libre** : Texte, communes, rues, gares
- **Navigation conditionnelle** : Questions suivantes basées sur les réponses

### ✅ **Interface d'administration**
- Consultation de toutes les réponses
- Détails complets de chaque participation
- Tri par date et filtrage
- Export des données (via Firebase Console)

### ✅ **Intégration Firebase**
- Sauvegarde en temps réel
- Base de données sécurisée
- Synchronisation automatique
- Compatible avec l'application Vue.js existante

## 🚀 Installation

### Sur Android :
1. **Activer les sources inconnues** dans les paramètres Android
2. **Télécharger** `AurayMobilite-Release.apk`
3. **Installer** l'APK
4. **Lancer** l'application

### Compatibilité :
- Android 7.0+ (API 24+)
- 50 MB d'espace libre
- Connexion Internet requise

## 📊 Structure des données

### Questions du sondage :
- **Q1** : Raison de présence en gare
- **Section Train** : Origine, transport, stationnement, destination
- **Section Car** : Origine, transport, destination  
- **Section Accompagnateurs** : Origine, transport

### Base de données :
- **Collection Firebase** : `Auray`
- **Format** : JSON avec timestamp
- **Compatible** avec l'application Vue.js existante

## 🛠️ Développement

### Prérequis installés :
```bash
- React Native CLI
- Firebase SDK
- Android Studio & SDK
- Node.js & npm
```

### Commandes utiles :
```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npx react-native run-android

# Construire l'APK release
cd android && ./gradlew assembleRelease

# Construire l'APK debug  
cd android && ./gradlew assembleDebug
```

## 🔧 Configuration

### Firebase :
- Projet : `reims-dc6cc`
- Collection : `Auray`
- Configuration dans : `src/config/firebaseConfig.ts`

### Personnalisation :
- Questions : `src/data/surveyQuestions.ts`
- Styles : Chaque composant a ses styles intégrés
- Theme : Couleurs dans le fichier de styles

## 📈 Migration depuis Vue.js

### ✅ **Fonctionnalités migrées :**
- ✅ Toutes les questions du sondage
- ✅ Logique de navigation conditionnelle
- ✅ Intégration Firebase identique
- ✅ Interface d'administration
- ✅ Validation des réponses
- ✅ Gestion des erreurs

### 🎨 **Améliorations React Native :**
- Interface mobile native optimisée
- Performances améliorées
- Expérience utilisateur fluide
- Navigation tactile intuitive
- Compatibilité hors-ligne partielle

## 👥 Partenaires

**Ville d'Auray • AQTA • Région Bretagne • SNCF**

---

## 🎉 **Mission accomplie !**

Votre application Vue.js a été **entièrement migrée vers React Native** et l'APK Android est prêt à être distribué !

### 📦 **Livrables :**
- ✅ Application React Native complète
- ✅ APK Release (49 MB) prêt pour distribution
- ✅ APK Debug (103 MB) pour tests
- ✅ Interface d'administration fonctionnelle
- ✅ Intégration Firebase identique à Vue.js
- ✅ Toutes les fonctionnalités du sondage
- ✅ Documentation complète
