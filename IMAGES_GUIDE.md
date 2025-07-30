# Guide d'utilisation des images dans les questions du sondage

## 🎯 Comment ça marche

Le système d'images est maintenant **flexible et centralisé** avec des fonctionnalités avancées :
- ✨ **Rendu amélioré** : Images sans bordures blanches avec ombres élégantes
- 🔍 **Zoom interactif** : Clic sur l'image pour l'agrandir en plein écran
- 📱 **Pinch-to-zoom** : Zoom avec les doigts dans la modal
- ♿ **Accessibilité** : Support complet des lecteurs d'écran

## 📁 Structure des fichiers

```
src/
├── assets/images/          # Dossier pour toutes les images
│   └── plan.png           # Image du plan de la gare
├── data/surveyQuestions.ts # Configuration des images
└── components/
    └── SingleChoiceQuestion.tsx # Affichage automatique + zoom
```

## ⚙️ Configuration

Dans `src/data/surveyQuestions.ts`, ajoutez simplement votre question à la configuration :

```typescript
export const questionImages = {
    // Questions existantes
    "Q3A_MONTANTS_TRAIN": {
        image: '/plan.png',
        imageAlt: 'Plan de la gare montrant les zones de stationnement'
    },
    
    // ✅ Ajouter une nouvelle question avec image
    "VOTRE_QUESTION_ID": {
        image: '/votre-image.png',
        imageAlt: 'Description de votre image'
    }
};
```

## 🔧 Ajouter une nouvelle image

### 1. Ajoutez l'image dans le dossier assets
```bash
cp votre-image.png src/assets/images/
```

### 2. Ajoutez le mapping dans SingleChoiceQuestion.tsx
```typescript
const imageMap: { [key: string]: any } = {
  '/plan.png': require('../assets/images/plan.png'),
  '/votre-image.png': require('../assets/images/votre-image.png'), // ← Ajoutez ici
};
```

### 3. Configurez la question
```typescript
"VOTRE_QUESTION_ID": {
    image: '/votre-image.png',
    imageAlt: 'Description alternative pour l\'accessibilité'
}
```

## 🎨 Fonctionnalités visuelles

### Rendu des images
- **Sans bordures blanches** : Design épuré et moderne
- **Ombres élégantes** : Profondeur visuelle avec `shadowColor`, `shadowOffset`
- **Coins arrondis** : `borderRadius: 12` pour un look moderne
- **Taille optimisée** : `220px` de hauteur pour une bonne visibilité

### Zoom interactif
- **Indicateur visuel** : "🔍 Appuyez pour agrandir" en bas à droite
- **Modal plein écran** : Fond noir transparent (95% d'opacité)
- **Pinch-to-zoom** : Zoom de 1x à 3x avec les doigts
- **Bouton de fermeture** : Bouton ✕ élégant en haut à droite
- **Description** : Texte d'aide en bas de la modal

## ✨ Avantages

- ✅ **Centralisé** : Toute la config des images à un seul endroit
- ✅ **Flexible** : Facile d'ajouter/modifier/retirer des images
- ✅ **Maintenable** : Séparation claire entre données et affichage
- ✅ **Type-safe** : Support TypeScript complet
- ✅ **Performant** : Images chargées seulement quand nécessaire
- ✅ **Interactif** : Zoom et navigation fluides
- ✅ **Moderne** : Design élégant sans bordures

## 🔄 Migration des anciennes images

Si vous avez des questions avec des propriétés `image` directement :

**Avant :**
```typescript
{
    id: "MA_QUESTION",
    text: "Ma question ?",
    image: '/plan.png',        // ❌ À supprimer
    imageAlt: 'Mon alt text',  // ❌ À supprimer
    type: 'singleChoice',
    // ...
}
```

**Après :**
```typescript
// Dans les questions (surveyQuestions)
{
    id: "MA_QUESTION",
    text: "Ma question ?",
    type: 'singleChoice',
    // ... (plus de propriétés image)
}

// Dans la configuration (questionImages)
"MA_QUESTION": {
    image: '/plan.png',
    imageAlt: 'Mon alt text'
}
```

## 📱 Expérience utilisateur

### Sur les questions avec images :
1. **Affichage compact** : Image de 220px optimisée pour mobile
2. **Indicateur de zoom** : Hint visuel discret mais visible
3. **Tap to zoom** : Simple appui pour agrandir

### Dans la modal de zoom :
1. **Immersion** : Fond noir pour focus sur l'image
2. **Contrôles intuitifs** : Pincer pour zoomer, tap pour fermer
3. **Navigation** : Bouton X visible et accessible
4. **Information** : Description de l'image toujours visible 