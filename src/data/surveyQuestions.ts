export const surveyQuestions = [
    // 👤 Âge
    {
        id: "Q1",
        text: "Quel âge avez-vous ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Moins de 18 ans", next: "Q2" },
            { id: 2, text: "Entre 18 et 25 ans", next: "Q2" },
            { id: 3, text: "Entre 26 et 35 ans", next: "Q2" },
            { id: 4, text: "Entre 36 et 50 ans", next: "Q2" },
            { id: 5, text: "Entre 51 et 60 ans", next: "Q2" },
            { id: 6, text: "Entre 61 et 70 ans", next: "Q2" },
            { id: 7, text: "71 ans et plus", next: "Q2" }
        ]
    },

    // 👤 Sexe
    {
        id: "Q2",
        text: "Sexe",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Femme", next: "Q3" },
            { id: 2, text: "Homme", next: "Q3" },
            { id: 3, text: "Je ne souhaite pas préciser", next: "Q3" }
        ]
    },

    // 🏠 Commune de résidence
    {
        id: "Q3",
        text: "Où habitez-vous ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Aigleville", next: "Q4" },
            { id: 2, text: "Bois-Jérôme-Saint-Ouen", next: "Q4" },
            { id: 3, text: "Boisset-les-Prévanches", next: "Q4" },
            { id: 4, text: "Bouafles", next: "Q4" },
            { id: 5, text: "Breuilpont", next: "Q4" },
            { id: 6, text: "Bueil", next: "Q4" },
            { id: 7, text: "Caillouet-Orgeville", next: "Q4" },
            { id: 8, text: "Chaignes", next: "Q4" },
            { id: 9, text: "Chambray", next: "Q4" },
            { id: 10, text: "Croisy-sur-Eure", next: "Q4" },
            { id: 11, text: "Cuverville", next: "Q4" },
            { id: 12, text: "Daubeuf-près-Vatteville", next: "Q4" },
            { id: 13, text: "Douains", next: "Q4" },
            { id: 14, text: "Écouis", next: "Q4" },
            { id: 15, text: "Fains", next: "Q4" },
            { id: 16, text: "Frenelles-en-Vexin", next: "Q4" },
            { id: 17, text: "Gadencourt", next: "Q4" },
            { id: 18, text: "Gasny", next: "Q4" },
            { id: 19, text: "Giverny", next: "Q4" },
            { id: 20, text: "Guiseniers", next: "Q4" },
            { id: 21, text: "Hardencourt-Cocherel", next: "Q4" },
            { id: 22, text: "Harquency", next: "Q4" },
            { id: 23, text: "Hécourt", next: "Q4" },
            { id: 24, text: "Hennezis", next: "Q4" },
            { id: 25, text: "Heubécourt-Haricourt", next: "Q4" },
            { id: 26, text: "Heuqueville", next: "Q4" },
            { id: 27, text: "Houlbec-Cocherel", next: "Q4" },
            { id: 28, text: "La Boissière", next: "Q4" },
            { id: 29, text: "La Chapelle-Longueville", next: "Q4" },
            { id: 30, text: "La Heunière", next: "Q4" },
            { id: 31, text: "La Roquette", next: "Q4" },
            { id: 32, text: "Le Cormier", next: "Q4" },
            { id: 33, text: "Le Plessis-Hébert", next: "Q4" },
            { id: 34, text: "Le Thuit", next: "Q4" },
            { id: 35, text: "Les Andelys", next: "Q4" },
            { id: 36, text: "Ménilles", next: "Q4" },
            { id: 37, text: "Mercey", next: "Q4" },
            { id: 38, text: "Merey", next: "Q4" },
            { id: 39, text: "Mesnil-Verclives", next: "Q4" },
            { id: 40, text: "Mézières-en-Vexin", next: "Q4" },
            { id: 41, text: "Muids", next: "Q4" },
            { id: 42, text: "Neuilly", next: "Q4" },
            { id: 43, text: "Notre-Dame-de-l'Isle", next: "Q4" },
            { id: 44, text: "Pacy-sur-Eure", next: "Q4" },
            { id: 45, text: "Port-Mort", next: "Q4" },
            { id: 46, text: "Pressagny-l'Orgueilleux", next: "Q4" },
            { id: 47, text: "Rouvray", next: "Q4" },
            { id: 48, text: "Saint-Marcel", next: "Q4" },
            { id: 49, text: "Saint-Vincent-des-Bois", next: "Q4" },
            { id: 50, text: "Sainte-Colombe-près-Vernon", next: "Q4" },
            { id: 51, text: "Sainte-Geneviève-lès-Gasny", next: "Q4" },
            { id: 52, text: "Suzay", next: "Q4" },
            { id: 53, text: "Tilly", next: "Q4" },
            { id: 54, text: "Vatteville", next: "Q4" },
            { id: 55, text: "Vaux-sur-Eure", next: "Q4" },
            { id: 56, text: "Vernon", next: "Q4" },
            { id: 57, text: "Vexin-sur-Epte", next: "Q4" },
            { id: 58, text: "Vézillon", next: "Q4" },
            { id: 59, text: "Villegats", next: "Q4" },
            { id: 60, text: "Villez-sous-Bailleul", next: "Q4" },
            { id: 61, text: "Villiers-en-Désœuvre", next: "Q4" },
            { id: 63, text: "Autre", next: "Q3_COMMUNE" }
        ]
    },

    // 🏠 Commune autre avec sélecteur
    {
        id: "Q3_COMMUNE",
        text: "Veuillez sélectionner votre commune :",
        type: 'commune',
        next: "Q4"
    },

    // 💼 Catégorie socio-professionnelle
    {
        id: "Q4",
        text: "Quelle est votre catégorie socio-professionnelle ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Agriculteurs exploitants", next: "Q5" },
            { id: 2, text: "Artisans, commerçants, chefs d'entreprise", next: "Q5" },
            { id: 3, text: "Cadre et profession intellectuelle supérieure", next: "Q5" },
            { id: 4, text: "Employé", next: "Q5" },
            { id: 5, text: "Étudiant", next: "Q5" },
            { id: 6, text: "Ouvrier", next: "Q5" },
            { id: 7, text: "Professions intermédiaires (technicien, contremaître, agent de maîtrise)", next: "Q5" },
            { id: 8, text: "Retraité", next: "Q5" },
            { id: 9, text: "En recherche d'emploi", next: "Q5" },
            { id: 10, text: "Autres", next: "Q4_PRECISION" }
        ]
    },

    // 📝 Précision catégorie professionnelle
    {
        id: "Q4_PRECISION",
        text: "Veuillez préciser votre catégorie socio-professionnelle :",
        type: 'freeText',
        freeTextPlaceholder: "Préciser...",
        next: "Q5"
    },

    // 🏢 Activité professionnelle
    {
        id: "Q5",
        text: "Êtes-vous en activité ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Oui", next: "Q6" },
            { id: 2, text: "Non", next: "Q7" }
        ]
    },

    // 📍 Lieu d'activité
    {
        id: "Q6",
        text: "Pouvez-vous préciser votre lieu d'activité ?",
        type: 'commune',
        next: "Q7"
    },

    // 🚗 Véhicule motorisé
    {
        id: "Q7",
        text: "Disposez-vous d'un véhicule motorisé ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Oui, électrique", next: "Q8" },
            { id: 2, text: "Oui, hybride", next: "Q8" },
            { id: 3, text: "Oui, thermique", next: "Q8" },
            { id: 4, text: "Non", next: "Q8" }
        ]
    },

    // 🚴 Possession d'un vélo
    {
        id: "Q8",
        text: "Possédez-vous un vélo ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Oui", next: "Q10" },
            { id: 2, text: "Oui, électrique", next: "Q10" },
            { id: 3, text: "Non", next: "Q9" }
        ]
    },

    // 🚲 Location de vélo
    {
        id: "Q9",
        text: "Vous arrive-t-il de louer un vélo ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Oui", next: "Q13" },
            { id: 2, text: "Non", next: "Q13" }
        ]
    },

    // 📅 Fréquence d'utilisation du vélo
    {
        id: "Q10",
        text: "À quelle fréquence utilisez-vous un vélo ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Plusieurs fois par jour", next: "Q11" },
            { id: 2, text: "Plusieurs fois par semaine", next: "Q11" },
            { id: 3, text: "Une fois par semaine", next: "Q11" },
            { id: 4, text: "Plusieurs fois par mois", next: "Q11" },
            { id: 5, text: "Une fois par mois", next: "Q11" },
            { id: 6, text: "Plusieurs fois par an", next: "Q11" },
            { id: 7, text: "Rarement", next: "Q11" },
            { id: 8, text: "Jamais", next: "Q11" }
        ]
    },

    // 🌍 Période d'utilisation
    {
        id: "Q11",
        text: "À quelle période de l'année utilisez-vous le plus souvent le vélo ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Toute l'année", next: "Q12" },
            { id: 2, text: "Seulement pendant les périodes printanières et estivales", next: "Q12" },
            { id: 3, text: "Cela dépend des conditions météorologiques", next: "Q12" },
            { id: 4, text: "Je ne l'utilise pas", next: "Q12" }
        ]
    },

    // 🎯 Raisons d'utilisation du vélo
    {
        id: "Q12",
        text: "Pour quelles raisons utilisez-vous votre vélo ? (plusieurs réponses possibles)",
        type: 'multipleChoice',
        options: [
            { id: 1, text: "Pour aller travailler" },
            { id: 2, text: "Pour aller à l'école" },
            { id: 3, text: "Pour le loisir" },
            { id: 4, text: "Pour le sport/entraînement" },
            { id: 5, text: "Pour faire mes courses" },
            { id: 6, text: "Pour aller chercher/déposer les enfants à l'école" },
            { id: 7, text: "Autre finalité", next_if_selected: "Q12_PRECISION" }
        ],
        next: "Q13"
    },

    // 📝 Précision autre finalité
    {
        id: "Q12_PRECISION",
        text: "Veuillez préciser l'autre finalité :",
        type: 'freeText',
        freeTextPlaceholder: "À préciser...",
        next: "Q13"
    },

    // 🚫 Raisons de non-utilisation du vélo
    {
        id: "Q13",
        text: "Si vous n'utilisez pas de vélo, pouvez-vous préciser pourquoi ? (plusieurs choix possibles)",
        type: 'multipleChoice',
        options: [
            { id: 1, text: "Manque de sécurité sur les routes" },
            { id: 2, text: "Manque d'infrastructures cyclables (pistes cyclables, parkings vélo sécurisés...)" },
            { id: 3, text: "Problèmes de santé ou incapacité physique" },
            { id: 4, text: "Distance trop importante pour mes déplacements quotidiens" },
            { id: 5, text: "Manque de temps ou de commodité" },
            { id: 6, text: "Préférence pour d'autres modes de transport" },
            { id: 7, text: "Mauvaises conditions météorologiques" },
            { id: 8, text: "Je n'ai pas de vélo" },
            { id: 9, text: "Autre raison", next_if_selected: "Q13_PRECISION" }
        ],
        next: "Q14"
    },

    // 📝 Précision autre raison non-utilisation
    {
        id: "Q13_PRECISION",
        text: "Veuillez préciser l'autre raison :",
        type: 'freeText',
        freeTextPlaceholder: "Préciser...",
        next: "Q14"
    },

    // 📏 Distance parcourue quotidiennement
    {
        id: "Q14",
        text: "Quelle distance parcourez-vous à vélo dans le cadre de vos déplacements quotidiens ?",
        type: 'freeText',
        condition: "Q10 == 1",
        freeTextPlaceholder: "Distance en kilomètres",
        validation: "numeric",
        next: "Q15"
    },

    // 🚧 Freins à l'utilisation du vélo
    {
        id: "Q15",
        text: "Selon votre ressenti ou votre expérience, quels sont les freins à l'utilisation du vélo sur le territoire de Seine Normandie Agglomération ? (plusieurs choix possibles)",
        type: 'multipleChoice',
        options: [
            { id: 1, text: "Le trafic routier/insécurité" },
            { id: 2, text: "La météo" },
            { id: 3, text: "Le vol de vélo" },
            { id: 4, text: "L'absence d'aménagements cyclables" },
            { id: 5, text: "L'effort physique que représente la pratique" },
            { id: 6, text: "Je n'aime pas le vélo" },
            { id: 7, text: "Aucun frein" }
        ],
        next: "Q16"
    },

    // 📊 Évaluation des infrastructures actuelles
    {
        id: "Q16",
        text: "Comment évaluez-vous les infrastructures cyclables actuelles sur le territoire ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Très satisfaisants", next: "Q17" },
            { id: 2, text: "Assez satisfaisants", next: "Q17" },
            { id: 3, text: "Peu satisfaisants", next: "Q17" },
            { id: 4, text: "Pas du tout satisfaisants", next: "Q17" },
            { id: 5, text: "Pas d'idée", next: "Q17" }
        ]
    },

    // 🛤️ Axes à créer pour compléter le réseau
    {
        id: "Q17",
        text: "Selon vous quel(s) axe(s) devrait être créé pour compléter le réseau ?",
        type: 'freeText',
        freeTextPlaceholder: "ex : Coulée Verte, piste cyclable entre commune X et Commune Y...",
        next: "Q18"
    },

    // 🛡️ Sentiment de sécurité (0-10)
    {
        id: "Q18",
        text: "Sur une échelle de 0 à 10, comment vous sentez-vous en vélo en matière de sécurité sur les axes routiers de Seine Normandie Agglomération ?",
        type: 'singleChoice',
        condition: "Q8 == 1 OR Q8 == 2",
        options: [
            { id: 0, text: "0 - Pas en sécurité", next: "Q19" },
            { id: 1, text: "1", next: "Q19" },
            { id: 2, text: "2", next: "Q19" },
            { id: 3, text: "3", next: "Q19" },
            { id: 4, text: "4", next: "Q19" },
            { id: 5, text: "5", next: "Q19" },
            { id: 6, text: "6", next: "Q19" },
            { id: 7, text: "7", next: "Q19" },
            { id: 8, text: "8", next: "Q19" },
            { id: 9, text: "9", next: "Q19" },
            { id: 10, text: "10 - Très en sécurité", next: "Q19" }
        ],
        fallbackNext: "Q21"
    },

    // 🛋️ Sentiment de confort (0-10)
    {
        id: "Q19",
        text: "Sur une échelle de 0 à 10, comment vous sentez-vous en vélo en matière de confort de circulation ? (Espaces de circulation larges, dégagés, entretenus, etc.)",
        type: 'singleChoice',
        condition: "Q8 == 1 OR Q8 == 2",
        options: [
            { id: 0, text: "0 - Pas de confort", next: "Q20" },
            { id: 1, text: "1", next: "Q20" },
            { id: 2, text: "2", next: "Q20" },
            { id: 3, text: "3", next: "Q20" },
            { id: 4, text: "4", next: "Q20" },
            { id: 5, text: "5", next: "Q20" },
            { id: 6, text: "6", next: "Q20" },
            { id: 7, text: "7", next: "Q20" },
            { id: 8, text: "8", next: "Q20" },
            { id: 9, text: "9", next: "Q20" },
            { id: 10, text: "10 - Beaucoup de confort", next: "Q20" }
        ],
        fallbackNext: "Q21"
    },

    // 🗺️ Itinéraire le plus emprunté
    {
        id: "Q20",
        text: "Quel itinéraire empruntez-vous le plus souvent à vélo ?",
        type: 'freeText',
        condition: "Q8 == 1 OR Q8 == 2",
        freeTextPlaceholder: "Décrire l'itinéraire...",
        next: "Q21"
    },

    // 📈 Évaluation de l'itinéraire principal
    {
        id: "Q21",
        text: "Comment évaluez-vous la qualité de cet itinéraire ?",
        type: 'singleChoice',
        condition: "Q20",
        options: [
            { id: 1, text: "Très satisfaisant", next: "Q22" },
            { id: 2, text: "Assez satisfaisant", next: "Q22" },
            { id: 3, text: "Peu satisfaisant", next: "Q22" },
            { id: 4, text: "Pas du tout satisfaisant", next: "Q22" }
        ]
    },

    // ⚠️ Points noirs identifiés
    {
        id: "Q22",
        text: "Avez-vous identifié des \"points noirs\" ou zones particulièrement dangereuses pour les cyclistes dans le territoire ?",
        type: 'singleChoice',
        condition: "(Q8 == 1 OR Q8 == 2) AND Q10 >= 1 AND Q10 <= 7",
        options: [
            { id: 1, text: "Oui", next: "Q22_PRECISION" },
            { id: 2, text: "Non", next: "Q23" }
        ],
        fallbackNext: "Q23"
    },

    // 📝 Précision points noirs
    {
        id: "Q22_PRECISION",
        text: "Veuillez préciser les points noirs identifiés :",
        type: 'freeText',
        freeTextPlaceholder: "Décrire les zones dangereuses...",
        next: "Q23"
    },

    // 🔒 Besoin de stationnement sécurisé
    {
        id: "Q23",
        text: "Avez-vous besoin de points de stationnement sécurisé ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Oui", next: "Q24" },
            { id: 2, text: "Non", next: "Q25" },
            { id: 3, text: "Autre réponse", next: "Q23_PRECISION" }
        ]
    },

    // 📝 Précision stationnement
    {
        id: "Q23_PRECISION",
        text: "Veuillez préciser votre réponse concernant le stationnement sécurisé :",
        type: 'freeText',
        freeTextPlaceholder: "Préciser...",
        next: "Q24"
    },

    // 📍 Localisation du stationnement sécurisé
    {
        id: "Q24",
        text: "Si oui, où ?",
        type: 'freeText',
        condition: "Q23 == 1",
        freeTextPlaceholder: "Préciser les lieux souhaités...",
        next: "Q25",
        fallbackNext: "Q25"
    },

    // 🚀 Disposition à utiliser davantage le vélo
    {
        id: "Q25",
        text: "Seriez-vous prêt(e) à utiliser davantage le vélo si l'offre était améliorée ?",
        type: 'freeText',
        freeTextPlaceholder: "Décrire les améliorations...",
        next: "end"
    },
];

// Message de bienvenue
export const welcomeMessage = `
Bonjour,

pour mieux connaître les usagers de la gare, la Ville d'Auray,
AQTA, la Région Bretagne et la SNCF souhaiteraient en savoir plus sur votre déplacement en cours.

Auriez-vous quelques secondes à nous accorder ?
`;

// Configuration des images pour les questions
export const questionImages = {
    // Questions de stationnement de véhicules
    "Q3A_MONTANTS_TRAIN": "/plan.png",
    "Q3B_DESCENDRE_TRAIN": "/plan.png",
    // Ajouter d'autres mappings d'images ici si nécessaire
    // "questionId": "/image_path.png"
};

// Configuration du sondage
export const surveyConfig = {
    title: 'Sondage Mobilité Gare d\'Auray',
    welcomeMessage,
    startQuestionId: 'Q1',
    firebaseCollection: 'NEWTEMPLATE'
};