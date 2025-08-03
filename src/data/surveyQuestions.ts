import { SurveyQuestion } from '../types/survey';

// 🚄 AURAY TRAIN STATION MOBILITY SURVEY
// Questions du sondage de mobilité ferroviaire d'Auray

export const surveyQuestions: SurveyQuestion[] = [
    // EXEMPLE - Question avec termination conditionnelle (âge minimum)
    {
        id: "AGE_CHECK",
        text: "Quel est votre âge ?",
        type: 'number',
        freeTextPlaceholder: "Entrez votre âge",
        validation: "numeric",
        conditionalNext: [
            {
                condition: "AGE_CHECK",
                routes: [
                    { value: "< 16", next: "MINOR_END" },
                    { value: ">= 16", next: "Q1" }
                ]
            }
        ],
        fallbackNext: "Q1"
    },

    // Fin du sondage pour les mineurs
    {
        id: "MINOR_END", 
        text: "Merci pour votre intérêt, mais ce sondage est réservé aux personnes de 16 ans et plus.",
        type: 'text',
        next: "end"
    },

    // Q1 - Raison de la présence en gare (filtre le flux du sondage)
    {
        id: "Q1",
        text: "Quelle est la raison de votre présence en gare ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Je vais prendre le train", next: "Q2_MONTANTS_TRAIN" },
            { id: 2, text: "Je vais prendre un car", next: "Q2_MONTANTS_CAR" },
            { id: 3, text: "J'accompagne des voyageurs qui partent / J'attends des voyageurs qui arrivent", next: "Q2_ACCOMPAGNATEURS" },
            { id: 4, text: "Autre raison", next_if_selected: "Q1_AUTRE" }
        ]
    },

    // EXEMPLE - Question de précision avec freeText
    {
        id: "Q1_AUTRE",
        text: "Précisez la raison de votre présence en gare :",
        type: 'freeText',
        freeTextPlaceholder: "Ex: promenade, commerce, visite...",
        next: "DEMOGRAPHICS"
    },

    // ============ SECTION DÉMONSTRATION - TOUS LES TYPES DE QUESTIONS ============
    
    // EXEMPLE - Demographics avec multipleChoice
    {
        id: "DEMOGRAPHICS",
        text: "Quelles catégories vous décrivent le mieux ? (Plusieurs réponses possibles)",
        type: 'multipleChoice',
        options: [
            { id: 1, text: "Étudiant(e)" },
            { id: 2, text: "Travailleur/se" },
            { id: 3, text: "Retraité(e)" },
            { id: 4, text: "À la recherche d'emploi" },
            { id: 5, text: "Parent accompagnant" },
            { id: 6, text: "Touriste" },
            { id: 7, text: "Autre", next_if_selected: "DEMOGRAPHICS_OTHER" }
        ],
        next: "FREQUENCY"
    },

    // EXEMPLE - Question de précision pour multipleChoice
    {
        id: "DEMOGRAPHICS_OTHER",
        text: "Précisez votre situation :",
        type: 'freeText',
        freeTextPlaceholder: "Ex: profession libérale, artisan...",
        next: "FREQUENCY"
    },

    // EXEMPLE - Question avec condition basée sur la réponse précédente
    {
        id: "FREQUENCY",
        text: "À quelle fréquence utilisez-vous cette gare ?",
        type: 'singleChoice',
        condition: "Q1 == 1 OR Q1 == 2", // Seulement pour ceux qui prennent le train ou car
        options: [
            { id: 1, text: "Tous les jours", next: "SATISFACTION" },
            { id: 2, text: "Plusieurs fois par semaine", next: "SATISFACTION" },
            { id: 3, text: "Une fois par semaine", next: "SATISFACTION" },
            { id: 4, text: "Occasionnellement", next: "RARE_USAGE" },
            { id: 5, text: "Première fois", next: "FIRST_TIME" }
        ],
        fallbackNext: "Q2_MONTANTS_TRAIN"
    },

    // EXEMPLE - Question conditionnelle pour usage rare 
    {
        id: "RARE_USAGE",
        text: "Pour quelles occasions utilisez-vous principalement cette gare ?",
        type: 'multipleChoice',
        options: [
            { id: 1, text: "Vacances" },
            { id: 2, text: "Rendez-vous médicaux" },
            { id: 3, text: "Visites familiales" },
            { id: 4, text: "Loisirs/sorties" },
            { id: 5, text: "Déplacements professionnels" }
        ],
        next: "SATISFACTION"
    },

    // EXEMPLE - Question pour première fois avec station selector
    {
        id: "FIRST_TIME",
        text: "D'où venez-vous habituellement pour vos déplacements en transport en commun ?",
        type: 'station',
        next: "SATISFACTION"
    },

    // EXEMPLE - Question avec conditionalText basée sur la fréquence
    {
        id: "SATISFACTION",
        text: "Question par défaut",
        type: 'singleChoice',
        conditionalText: {
            condition: "FREQUENCY",
            routes: [
                { value: 1, text: "En tant qu'usager quotidien, comment évaluez-vous cette gare ?" },
                { value: 2, text: "En tant qu'usager régulier, comment évaluez-vous cette gare ?" },
                { value: 3, text: "En tant qu'usager hebdomadaire, comment évaluez-vous cette gare ?" },
                { value: 4, text: "En tant qu'usager occasionnel, comment évaluez-vous cette gare ?" },
                { value: 5, text: "Pour cette première visite, comment évaluez-vous cette gare ?" }
            ]
        },
        options: [
            { id: 1, text: "Très satisfait(e)", next: "CONTACT_INFO" },
            { id: 2, text: "Satisfait(e)", next: "CONTACT_INFO" },
            { id: 3, text: "Neutre", next: "CONTACT_INFO" },
            { id: 4, text: "Insatisfait(e)", next: "IMPROVEMENTS" },
            { id: 5, text: "Très insatisfait(e)", next: "IMPROVEMENTS" }
        ]
    },

    // EXEMPLE - Question d'amélioration avec multipleChoice complexe
    {
        id: "IMPROVEMENTS",
        text: "Quelles améliorations souhaiteriez-vous voir ? (Plusieurs réponses possibles)",
        type: 'multipleChoice',
        options: [
            { id: 1, text: "Plus de places de parking" },
            { id: 2, text: "Meilleurs abris vélo" },
            { id: 3, text: "Plus d'informations voyageurs" },
            { id: 4, text: "Amélioration de la propreté" },
            { id: 5, text: "Meilleure accessibilité PMR" },
            { id: 6, text: "Plus de commerces/services" },
            { id: 7, text: "Autre amélioration", next_if_selected: "IMPROVEMENTS_OTHER" }
        ],
        next: "CONTACT_INFO"
    },

    // EXEMPLE - Précision pour autres améliorations
    {
        id: "IMPROVEMENTS_OTHER",
        text: "Précisez les améliorations souhaitées :",
        type: 'freeText',
        freeTextPlaceholder: "Décrivez les améliorations que vous souhaiteriez...",
        next: "CONTACT_INFO"
    },

    // EXEMPLE - Contact avec validation email
    {
        id: "CONTACT_INFO",
        text: "Souhaitez-vous être recontacté(e) pour des études complémentaires ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Oui, voici mon email", next: "EMAIL" },
            { id: 2, text: "Non merci", next: "Q2_MONTANTS_TRAIN" }
        ]
    },

    // EXEMPLE - Saisie email avec validation
    {
        id: "EMAIL",
        text: "Veuillez saisir votre adresse email :",
        type: 'freeText',
        freeTextPlaceholder: "votre.email@exemple.fr",
        validation: "email",
        next: "Q2_MONTANTS_TRAIN"
    },

    // ============ SECTION MONTANTS TRAIN ============

    // Q2 - Origine pour les passagers du train
    {
        id: "Q2_MONTANTS_TRAIN",
        text: "Quelle est l'origine de votre déplacement ? D'où êtes-vous parti pour arriver à la gare ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Auray", next: "Q2A_MONTANTS_TRAIN" },
            { id: 2, text: "Brech", next: "Q2A_MONTANTS_TRAIN" },
            { id: 3, text: "Autre commune", next: "Q2_AUTRE_MONTANTS_TRAIN" }
        ]
    },

    // Q2 - Autre commune pour les passagers du train
    {
        id: "Q2_AUTRE_MONTANTS_TRAIN",
        text: "Préciser nom de la commune :",
        type: 'commune',
        next: "Q3_MONTANTS_TRAIN"
    },

    // Q2a - Rue à Auray/Brech pour les passagers du train
    {
        id: "Q2A_MONTANTS_TRAIN",
        text: "De quelle rue venez-vous ?",
        type: 'street',
        next: "Q3_MONTANTS_TRAIN"
    },

    // Q3 - Mode de transport vers la gare pour les passagers du train
    {
        id: "Q3_MONTANTS_TRAIN",
        text: "Quel mode de transport avez-vous utilisé pour vous rendre à la gare ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "À pied", next: "Q4_MONTANTS_TRAIN" },
            { id: 2, text: "En voiture -- en tant que conducteur", next: "Q3A_MONTANTS_TRAIN" },
            { id: 3, text: "En voiture -- en tant que passager", next: "Q4_MONTANTS_TRAIN" },
            { id: 4, text: "En covoiturage avec un autre usager du train", next: "Q4_MONTANTS_TRAIN" },
            { id: 5, text: "En bus/car", next: "Q3B_MONTANTS_TRAIN" },
            { id: 6, text: "À vélo", next: "Q3D_MONTANTS_TRAIN" },
            { id: 7, text: "En trottinette", next: "Q3D_MONTANTS_TRAIN" },
            { id: 8, text: "En Taxi/VTC", next: "Q4_MONTANTS_TRAIN" },
            { id: 9, text: "En 2 roues Motorisé (Moto, scooter...)", next: "Q3A_MONTANTS_TRAIN" },
            { id: 10, text: "En train - je fais une correspondance", next: "Q4_MONTANTS_TRAIN" },
            { id: 11, text: "Autre", next: "Q3_AUTRE_MONTANTS_TRAIN" }
        ]
    },

    // Q3 - Autre mode de transport pour les passagers du train
    {
        id: "Q3_AUTRE_MONTANTS_TRAIN",
        text: "Préciser le mode de transport :",
        type: 'text',
        next: "Q4_MONTANTS_TRAIN"
    },

    // Q3a - Lieu de stationnement du véhicule pour les passagers du train
    {
        id: "Q3A_MONTANTS_TRAIN",
        text: "Où avez-vous stationné votre véhicule ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Sur le parking de la gare Sud (côté Auray)", next: "Q3A_PRIME_MONTANTS_TRAIN" },
            { id: 2, text: "Sur le parking de la gare Nord (côté Brech)", next: "Q3A_PRIME_MONTANTS_TRAIN" },
            { id: 3, text: "Sur le parking Mermoz au Sud", next: "Q3A_PRIME_MONTANTS_TRAIN" },
            { id: 4, text: "Sur le parking Hulot au Sud", next: "Q3A_PRIME_MONTANTS_TRAIN" },
            { id: 5, text: "Sur une autre place en voirie ou parking au sud de la gare", next: "Q3A_PRIME_MONTANTS_TRAIN" },
            { id: 6, text: "Sur une autre place en voirie ou parking au nord de la gare", next: "Q3A_PRIME_MONTANTS_TRAIN" },
            { id: 7, text: "Sur un stationnement privé (box ou place de parking privée)", next: "Q3A_PRIME_MONTANTS_TRAIN" }
        ]
    },

    // Q3a' - Durée de stationnement pour les passagers du train
    {
        id: "Q3A_PRIME_MONTANTS_TRAIN",
        text: "Combien de temps allez-vous laisser votre véhicule stationné ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Moins de 2 heures", next: "Q4_MONTANTS_TRAIN" },
            { id: 2, text: "Une demi-journée (entre 2 et 4 heures)", next: "Q4_MONTANTS_TRAIN" },
            { id: 3, text: "Une journée entière (entre 4h et 12h)", next: "Q4_MONTANTS_TRAIN" },
            { id: 4, text: "2 à 3 jours", next: "Q4_MONTANTS_TRAIN" },
            { id: 5, text: "3 à 6 jours", next: "Q4_MONTANTS_TRAIN" },
            { id: 6, text: "1 semaine ou plus", next: "Q4_MONTANTS_TRAIN" }
        ]
    },

    // Q3b - Ligne de bus pour les passagers du train
    {
        id: "Q3B_MONTANTS_TRAIN",
        text: "Quelle ligne de bus/car avez-vous emprunté ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Ligne BreizhGo n°1 (Belz-Plouharnel-Carnac-Auray)", next: "Q4_MONTANTS_TRAIN" },
            { id: 2, text: "Ligne BreizhGo n°5 (Baud-Auray-Vannes)", next: "Q4_MONTANTS_TRAIN" },
            { id: 3, text: "Ligne BreizhGo n°6 (Baden-Auray)", next: "Q4_MONTANTS_TRAIN" },
            { id: 4, text: "Ligne BreizhGo n°18 (Belz-Auray)", next: "Q4_MONTANTS_TRAIN" },
            { id: 5, text: "Auray Bus -- ligne rouge", next: "Q4_MONTANTS_TRAIN" },
            { id: 6, text: "Auray Bus -- ligne jaune", next: "Q4_MONTANTS_TRAIN" },
            { id: 7, text: "Autre", next: "Q3B_AUTRE_MONTANTS_TRAIN" }
        ]
    },

    // Q3b - Autre ligne de bus pour les passagers du train
    {
        id: "Q3B_AUTRE_MONTANTS_TRAIN",
        text: "Préciser la ligne (Exemple : Flixbus, Blablabus) :",
        type: 'text',
        next: "Q4_MONTANTS_TRAIN"
    },

    // Q3d - Stationnement vélo/trottinette pour les passagers du train
    {
        id: "Q3D_MONTANTS_TRAIN",
        text: "Où avez-vous stationné votre vélo/trottinette ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Sur les arceaux sous les abris côté parvis Sud", next: "Q4_MONTANTS_TRAIN" },
            { id: 2, text: "Sous l'abri sécurisé Breizhgo côté parvis Sud", next: "Q4_MONTANTS_TRAIN" },
            { id: 3, text: "Sur les arceaux sous les abris côté parking Nord", next: "Q4_MONTANTS_TRAIN" },
            { id: 4, text: "Sous l'abri sécurisé Breizhgo côté parking Nord", next: "Q4_MONTANTS_TRAIN" },
            { id: 5, text: "Je le transporte avec moi dans le train", next: "Q4_MONTANTS_TRAIN" },
            { id: 6, text: "Autre", next: "Q3D_AUTRE_MONTANTS_TRAIN" }
        ]
    },

    // Q3d - Autre stationnement vélo pour les passagers du train
    {
        id: "Q3D_AUTRE_MONTANTS_TRAIN",
        text: "Préciser où :",
        type: 'text',
        next: "Q4_MONTANTS_TRAIN"
    },

    // Q4 - Destination finale pour les passagers du train
    {
        id: "Q4_MONTANTS_TRAIN",
        text: "Quelle est votre destination finale aujourd'hui ?",
        type: 'gare',
        next: "end"
    },

    // ============ SECTION MONTANTS CAR ============

    // Q2 - Origine pour les passagers du car
    {
        id: "Q2_MONTANTS_CAR",
        text: "Quelle est l'origine de votre déplacement ? D'où êtes-vous parti pour arriver à la gare ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Auray", next: "Q3_MONTANTS_CAR" },
            { id: 2, text: "Brech", next: "Q3_MONTANTS_CAR" },
            { id: 3, text: "Autre commune", next: "Q2_AUTRE_MONTANTS_CAR" }
        ]
    },

    // Q2 - Autre commune pour les passagers du car
    {
        id: "Q2_AUTRE_MONTANTS_CAR",
        text: "Préciser nom de la commune :",
        type: 'commune',
        next: "Q3_MONTANTS_CAR"
    },

    // Q3 - Mode de transport vers la gare pour les passagers du car
    {
        id: "Q3_MONTANTS_CAR",
        text: "Quel mode de transport avez-vous utilisé pour vous rendre à la gare ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "À pied", next: "Q4_MONTANTS_CAR" },
            { id: 2, text: "En voiture", next: "Q4_MONTANTS_CAR" },
            { id: 3, text: "À vélo", next: "Q4_MONTANTS_CAR" },
            { id: 4, text: "En trottinette", next: "Q4_MONTANTS_CAR" },
            { id: 5, text: "En Taxi/VTC", next: "Q4_MONTANTS_CAR" },
            { id: 6, text: "En train", next: "Q4_MONTANTS_CAR" },
            { id: 7, text: "Autre", next: "Q3_AUTRE_MONTANTS_CAR" }
        ]
    },

    // Q3 - Autre mode de transport pour les passagers du car
    {
        id: "Q3_AUTRE_MONTANTS_CAR",
        text: "Préciser le mode de transport :",
        type: 'text',
        next: "Q4_MONTANTS_CAR"
    },

    // Q4 - Destination finale pour les passagers du car
    {
        id: "Q4_MONTANTS_CAR",
        text: "Quelle est votre destination finale aujourd'hui ?",
        type: 'text',
        next: "end"
    },

    // ============ SECTION ACCOMPAGNATEURS ============

    // Q2 - Origine pour les accompagnateurs
    {
        id: "Q2_ACCOMPAGNATEURS",
        text: "Quelle est l'origine de votre déplacement ? D'où êtes-vous parti pour arriver à la gare ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Auray", next: "Q3_ACCOMPAGNATEURS" },
            { id: 2, text: "Brech", next: "Q3_ACCOMPAGNATEURS" },
            { id: 3, text: "Autre commune", next: "Q2_AUTRE_ACCOMPAGNATEURS" }
        ]
    },

    // Q2 - Autre commune pour les accompagnateurs
    {
        id: "Q2_AUTRE_ACCOMPAGNATEURS",
        text: "Préciser nom de la commune :",
        type: 'commune',
        next: "Q3_ACCOMPAGNATEURS"
    },

    // Q3 - Mode de transport vers la gare pour les accompagnateurs
    {
        id: "Q3_ACCOMPAGNATEURS",
        text: "Quel mode de transport avez-vous utilisé pour vous rendre à la gare ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "À pied", next: "end" },
            { id: 2, text: "En voiture", next: "end" },
            { id: 3, text: "À vélo", next: "end" },
            { id: 4, text: "En trottinette", next: "end" },
            { id: 5, text: "En bus/car", next: "end" },
            { id: 6, text: "En Taxi/VTC", next: "end" },
            { id: 7, text: "Autre", next: "Q3_AUTRE_ACCOMPAGNATEURS" }
        ]
    },

    // Q3 - Autre mode de transport pour les accompagnateurs
    {
        id: "Q3_AUTRE_ACCOMPAGNATEURS",
        text: "Préciser le mode de transport :",
        type: 'text',
        next: "end"
    }
];

// Message de bienvenue
export const welcomeMessage = `
Bonjour,

pour mieux connaître les usagers de la gare, la Ville d'Auray,
AQTA, la Région Bretagne et la SNCF souhaiteraient en savoir plus sur votre déplacement en cours.

Auriez-vous quelques secondes à nous accorder ?
`;

// Configuration du sondage
export const surveyConfig = {
    title: 'Sondage Mobilité Gare d\'Auray',
    welcomeMessage,
    startQuestionId: 'AGE_CHECK', // Commence par la vérification d'âge
    firebaseCollection: 'Auray'
};

// Configuration des images pour les questions
export const questionImages = {
    // Questions de stationnement de véhicules
    "Q3A_MONTANTS_TRAIN": {
        image: '/plan.png',
        imageAlt: 'Plan de la gare montrant les zones de stationnement'
    },
    // Questions de stationnement vélo/trottinette  
    "Q3D_MONTANTS_TRAIN": {
        image: '/plan.png',
        imageAlt: 'Plan de la gare montrant les zones de stationnement vélo'
    },
    // Exemples d'autres questions avec images (décommentez si besoin) :
    // "Q3A_ACCOMPAGNATEURS": {
    //     image: '/plan.png',
    //     imageAlt: 'Plan de la gare montrant les zones de stationnement'
    // },
    // "Q1": {
    //     image: '/gare_overview.png',
    //     imageAlt: 'Vue d\'ensemble de la gare d\'Auray'
    // },
    // "Q4_MONTANTS_TRAIN": {
    //     image: '/destinations_map.png',
    //     imageAlt: 'Carte des destinations depuis la gare d\'Auray'
    // }
};

/*
🎯 FONCTIONNALITÉS COMPLÈTES DU SYSTÈME DE SONDAGE - AURAY MOBILE

📋 TYPES DE QUESTIONS SUPPORTÉS:
✅ singleChoice - Questions à choix unique avec navigation
✅ multipleChoice - Questions à choix multiples avec options diverses
✅ freeText - Saisie de texte libre avec placeholder et validation
✅ text - Saisie de texte simple (alias de freeText)
✅ number - Saisie numérique avec validation
✅ commune - Sélecteur de commune française
✅ street - Sélecteur de nom de rue
✅ gare - Sélecteur de gare ferroviaire
✅ station - Sélecteur de station/arrêt de transport

🔀 LOGIQUE CONDITIONNELLE AVANCÉE:
✅ condition - Afficher une question seulement si certaines conditions sont remplies
     Exemple: condition: "Q1 == 1 OR Q1 == 2" (affiche seulement si train ou car)
✅ conditionalText - Changer le texte de la question selon les réponses précédentes
     Exemple: Question différente selon l'âge ou la fréquence d'usage
✅ conditionalNext - Router vers différentes questions selon les réponses
     Exemple: Différents chemins selon l'âge (mineurs vs adultes)
✅ next_if_selected - Aller vers une question de précision si une option spécifique est choisie
     Exemple: "Autre" redirige vers une question de précision
✅ fallbackNext - Navigation par défaut si les conditions ne sont pas remplies
✅ Terminaison de sondage - Finir le sondage tôt pour certaines réponses (ex: mineurs)

🧠 FONCTIONNALITÉS AVANCÉES:
✅ Conditions complexes AND/OR ("AGE >= 2 AND AGE <= 3")
✅ Navigation conditionnelle avec plusieurs critères
✅ Questions de précision pour les options "Autre"
✅ Validation des champs (numeric, email, etc.)
✅ Placeholders personnalisés pour les champs de saisie
✅ Navigation dynamique basée sur le contexte
✅ Collections Firebase configurables

📊 EXEMPLES D'UTILISATION DANS CE FICHIER:

🎂 AGE_CHECK: Question numérique avec validation et terminaison conditionnelle
📊 DEMOGRAPHICS: Question multipleChoice avec redirection vers précision
🔄 FREQUENCY: Question conditionnelle (seulement pour train/car)
📱 SATISFACTION: Question avec texte conditionnel selon la fréquence
📧 EMAIL: Question avec validation email
🚉 FIRST_TIME: Exemple d'utilisation du sélecteur de station

🔄 FLUX DU SONDAGE:
1. Vérification d'âge (avec terminaison si mineur)
2. Question principale sur la raison de présence
3. Section démonstration (fréquence, satisfaction, améliorations)
4. Contact optionnel avec validation email
5. Questions originales de mobilité (train, car, accompagnateurs)

💡 COMMENT UTILISER:
1. Créez vos questions en utilisant les types supportés
2. Utilisez 'condition' pour les questions conditionnelles
3. Utilisez 'next_if_selected' pour les précisions d'options "Autre"
4. Configurez 'startQuestionId' dans surveyConfig
5. L'app mobile s'adapte automatiquement à votre configuration

🚀 CE SONDAGE DÉMONTRE TOUTES LES FONCTIONNALITÉS IMPLÉMENTÉES !
Pour créer un nouveau sondage, remplacez simplement le contenu de surveyQuestions
et configurez surveyConfig selon vos besoins.
*/