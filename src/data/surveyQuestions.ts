// 🧪 QUESTIONNAIRE DE TEST AVEC CONDITIONS COMPLEXES
// Ce questionnaire teste TOUTES les fonctionnalités conditionnelles

export const surveyQuestions = [
    // 🚀 Question de démarrage - Âge avec condition de fin
    {
        id: "START",
        text: "Bienvenue ! Quel âge avez-vous ?",
        type: 'number',
        validation: 'numeric',
        freeTextPlaceholder: "Votre âge en années",
        conditionalNext: [
            {
                condition: "START < 16",
                routes: [
                    { value: "START < 16", next: "TOO_YOUNG" }
                ]
            }
        ],
        fallbackNext: "AGE_GROUP"
    },

    // ❌ Fin prématurée pour les mineurs
    {
        id: "TOO_YOUNG",
        text: "Désolé, cette enquête est réservée aux personnes de 16 ans et plus. Merci de votre compréhension.",
        type: 'text'
        // Pas de next = fin du questionnaire
    },

    // 👥 Catégorisation par âge avec navigation conditionnelle
    {
        id: "AGE_GROUP",
        text: "Dans quelle tranche d'âge vous situez-vous ?",
        type: 'singleChoice',
        condition: "START >= 16", // Ne s'affiche que si âge >= 16
        options: [
            { id: 1, text: "16-25 ans", next: "STUDENT_CHECK" },
            { id: 2, text: "26-35 ans", next: "WORK_STATUS" },
            { id: 3, text: "36-50 ans", next: "WORK_STATUS" },
            { id: 4, text: "51 ans et plus", next: "RETIREMENT_CHECK" }
        ]
    },

    // 🎓 Vérification étudiant (seulement pour 16-25 ans)
    {
        id: "STUDENT_CHECK",
        text: "Êtes-vous actuellement étudiant(e) ?",
        type: 'singleChoice',
        condition: "AGE_GROUP == 1", // Seulement pour les 16-25 ans
        options: [
            { 
                id: 1, 
                text: "Oui, étudiant(e)", 
                next: "STUDIES_TYPE",
                next_if_selected: "STUDIES_TYPE" 
            },
            { id: 2, text: "Non, je travaille", next: "WORK_STATUS" },
            { id: 3, text: "Ni étudiant, ni en emploi", next: "UNEMPLOYED_REASON" }
        ]
    },

    // 📚 Type d'études (avec choix multiples et précision)
    {
        id: "STUDIES_TYPE",
        text: "Quel(s) type(s) d'études suivez-vous ? (Plusieurs choix possibles)",
        type: 'multipleChoice',
        condition: "STUDENT_CHECK == 1",
        options: [
            { id: 1, text: "Université" },
            { id: 2, text: "École de commerce" },
            { id: 3, text: "École d'ingénieur" },
            { id: 4, text: "Formation professionnelle" },
            { id: 5, text: "BTS/DUT" },
            { 
                id: 6, 
                text: "Autre type d'études", 
                next_if_selected: "STUDIES_OTHER"
            }
        ],
        next: "TRANSPORT_FREQUENCY"
    },

    // 📝 Précision sur les autres études
    {
        id: "STUDIES_OTHER",
        text: "Veuillez préciser le type d'études :",
        type: 'freeText',
        condition: "STUDIES_TYPE CONTAINS 6",
        freeTextPlaceholder: "Ex: École d'art, formation en ligne...",
        next: "TRANSPORT_FREQUENCY"
    },

    // 💼 Statut professionnel
    {
        id: "WORK_STATUS",
        text: "Quelle est votre situation professionnelle ?",
        type: 'singleChoice',
        condition: "AGE_GROUP == 2 OR AGE_GROUP == 3 OR STUDENT_CHECK == 2",
        options: [
            { id: 1, text: "Salarié(e) à temps plein" },
            { id: 2, text: "Salarié(e) à temps partiel" },
            { id: 3, text: "Indépendant(e)/Freelance" },
            { id: 4, text: "Chef d'entreprise" },
            { id: 5, text: "Fonctionnaire" },
            { 
                id: 6, 
                text: "En recherche d'emploi", 
                next: "UNEMPLOYED_REASON"
            },
            { 
                id: 7, 
                text: "Autre situation", 
                next_if_selected: "WORK_OTHER"
            }
        ],
        next: "WORK_LOCATION"
    },

    // 📝 Autre situation professionnelle
    {
        id: "WORK_OTHER",
        text: "Précisez votre situation professionnelle :",
        type: 'freeText',
        condition: "WORK_STATUS == 7",
        freeTextPlaceholder: "Ex: En formation, congé parental...",
        next: "WORK_LOCATION"
    },

    // 🏢 Lieu de travail (avec texte conditionnel)
    {
        id: "WORK_LOCATION",
        conditionalText: {
            condition: "WORK_STATUS == 1 OR WORK_STATUS == 2 OR WORK_STATUS == 5",
            routes: [
                { 
                    value: "WORK_STATUS == 1 OR WORK_STATUS == 2 OR WORK_STATUS == 5", 
                    text: "Où travaillez-vous principalement ?" 
                }
            ]
        },
        text: "Où exercez-vous principalement votre activité ?", // Texte par défaut
        type: 'commune',
        condition: "WORK_STATUS != 6 AND WORK_STATUS IS NOT NULL",
        next: "TRANSPORT_FREQUENCY"
    },

    // 🔍 Raison du chômage
    {
        id: "UNEMPLOYED_REASON",
        text: "Pour quelle raison principale n'êtes-vous pas en emploi ?",
        type: 'multipleChoice',
        condition: "STUDENT_CHECK == 3 OR WORK_STATUS == 6",
        options: [
            { id: 1, text: "Recherche active d'emploi" },
            { id: 2, text: "En formation/reconversion" },
            { id: 3, text: "Problème de santé" },
            { id: 4, text: "Garde d'enfants" },
            { id: 5, text: "Choix personnel" },
            { 
                id: 6, 
                text: "Autre raison", 
                next_if_selected: "UNEMPLOYED_OTHER"
            }
        ],
        next: "TRANSPORT_FREQUENCY"
    },

    // 📝 Autre raison de non-emploi
    {
        id: "UNEMPLOYED_OTHER",
        text: "Précisez la raison :",
        type: 'freeText',
        condition: "UNEMPLOYED_REASON CONTAINS 6",
        freeTextPlaceholder: "Votre situation...",
        next: "TRANSPORT_FREQUENCY"
    },

    // 👴 Vérification retraite (pour 51 ans et plus)
    {
        id: "RETIREMENT_CHECK",
        text: "Êtes-vous à la retraite ?",
        type: 'singleChoice',
        condition: "AGE_GROUP == 4",
        options: [
            { id: 1, text: "Oui, totalement retraité(e)", next: "RETIREMENT_ACTIVITIES" },
            { id: 2, text: "Retraité(e) mais travaille encore", next: "WORK_STATUS" },
            { id: 3, text: "Pas encore à la retraite", next: "WORK_STATUS" }
        ]
    },

    // 🎯 Activités de retraite
    {
        id: "RETIREMENT_ACTIVITIES",
        text: "Quelles sont vos principales activités ? (Plusieurs choix possibles)",
        type: 'multipleChoice',
        condition: "RETIREMENT_CHECK == 1",
        options: [
            { id: 1, text: "Bénévolat/Associations" },
            { id: 2, text: "Activités culturelles" },
            { id: 3, text: "Sport/Loisirs" },
            { id: 4, text: "Garde des petits-enfants" },
            { id: 5, text: "Voyages" },
            { id: 6, text: "Jardinage/Bricolage" },
            { 
                id: 7, 
                text: "Autres activités", 
                next_if_selected: "RETIREMENT_OTHER"
            }
        ],
        next: "TRANSPORT_FREQUENCY"
    },

    // 📝 Autres activités de retraite
    {
        id: "RETIREMENT_OTHER",
        text: "Précisez vos autres activités :",
        type: 'freeText',
        condition: "RETIREMENT_ACTIVITIES CONTAINS 7",
        freeTextPlaceholder: "Vos activités...",
        next: "TRANSPORT_FREQUENCY"
    },

    // 🚌 Fréquence d'utilisation des transports (avec navigation complexe)
    {
        id: "TRANSPORT_FREQUENCY",
        text: "À quelle fréquence utilisez-vous les transports en commun ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Tous les jours" },
            { id: 2, text: "Plusieurs fois par semaine" },
            { id: 3, text: "Une fois par semaine" },
            { id: 4, text: "Quelques fois par mois" },
            { id: 5, text: "Rarement" },
            { id: 6, text: "Jamais", next: "NO_TRANSPORT_REASON" }
        ],
        conditionalNext: [
            {
                condition: "TRANSPORT_FREQUENCY == 1 OR TRANSPORT_FREQUENCY == 2",
                routes: [
                    { 
                        value: "TRANSPORT_FREQUENCY IN [1,2]", 
                        next: "REGULAR_USER_QUESTIONS" 
                    }
                ]
            },
            {
                condition: "TRANSPORT_FREQUENCY == 3 OR TRANSPORT_FREQUENCY == 4",
                routes: [
                    { 
                        value: "TRANSPORT_FREQUENCY IN [3,4]", 
                        next: "OCCASIONAL_USER_QUESTIONS" 
                    }
                ]
            }
        ],
        fallbackNext: "RARE_USER_QUESTIONS"
    },

    // 🚫 Raison de non-utilisation
    {
        id: "NO_TRANSPORT_REASON",
        text: "Pourquoi n'utilisez-vous jamais les transports en commun ?",
        type: 'multipleChoice',
        condition: "TRANSPORT_FREQUENCY == 6",
        options: [
            { id: 1, text: "Je n'en ai pas besoin" },
            { id: 2, text: "Pas d'offre disponible près de chez moi" },
            { id: 3, text: "Trop cher" },
            { id: 4, text: "Pas assez fiable" },
            { id: 5, text: "Problème de mobilité/santé" },
            { id: 6, text: "Je préfère ma voiture" },
            { 
                id: 7, 
                text: "Autre raison", 
                next_if_selected: "NO_TRANSPORT_OTHER"
            }
        ],
        next: "IMPROVEMENT_SUGGESTIONS"
    },

    // 📝 Autre raison de non-utilisation
    {
        id: "NO_TRANSPORT_OTHER",
        text: "Précisez la raison :",
        type: 'freeText',
        condition: "NO_TRANSPORT_REASON CONTAINS 7",
        freeTextPlaceholder: "Votre raison...",
        next: "IMPROVEMENT_SUGGESTIONS"
    },

    // 🚌 Questions pour utilisateurs réguliers
    {
        id: "REGULAR_USER_QUESTIONS",
        text: "Quelles lignes utilisez-vous le plus souvent ? (Plusieurs choix possibles)",
        type: 'multipleChoice',
        condition: "TRANSPORT_FREQUENCY == 1 OR TRANSPORT_FREQUENCY == 2",
        options: [
            { id: 1, text: "Bus urbains" },
            { id: 2, text: "Bus interurbains" },
            { id: 3, text: "Train" },
            { id: 4, text: "Métro" },
            { id: 5, text: "Tramway" },
            { 
                id: 6, 
                text: "Autre type de transport", 
                next_if_selected: "TRANSPORT_TYPE_OTHER"
            }
        ],
        next: "SATISFACTION_REGULAR"
    },

    // 📝 Autre type de transport
    {
        id: "TRANSPORT_TYPE_OTHER",
        text: "Précisez le type de transport :",
        type: 'freeText',
        condition: "REGULAR_USER_QUESTIONS CONTAINS 6",
        freeTextPlaceholder: "Ex: navette, transport à la demande...",
        next: "SATISFACTION_REGULAR"
    },

    // ⭐ Satisfaction utilisateurs réguliers (avec texte conditionnel complexe)
    {
        id: "SATISFACTION_REGULAR",
        conditionalText: {
            condition: "AGE_GROUP == 1 AND STUDENT_CHECK == 1",
            routes: [
                { 
                    value: "AGE_GROUP == 1 AND STUDENT_CHECK == 1", 
                    text: "En tant qu'étudiant(e), êtes-vous satisfait(e) des transports pour vos trajets quotidiens ?" 
                }
            ]
        },
        text: "Globalement, êtes-vous satisfait(e) des transports en commun ?",
        type: 'singleChoice',
        condition: "TRANSPORT_FREQUENCY == 1 OR TRANSPORT_FREQUENCY == 2",
        options: [
            { id: 1, text: "Très satisfait(e)" },
            { id: 2, text: "Plutôt satisfait(e)" },
            { id: 3, text: "Plutôt mécontent(e)" },
            { id: 4, text: "Très mécontent(e)" }
        ],
        conditionalNext: [
            {
                condition: "SATISFACTION_REGULAR >= 3",
                routes: [
                    { 
                        value: "SATISFACTION_REGULAR >= 3", 
                        next: "PROBLEMS_REGULAR" 
                    }
                ]
            }
        ],
        fallbackNext: "STATION_PREFERENCE"
    },

    // ⚠️ Problèmes des utilisateurs réguliers mécontents
    {
        id: "PROBLEMS_REGULAR",
        text: "Quels sont les principaux problèmes que vous rencontrez ?",
        type: 'multipleChoice',
        condition: "SATISFACTION_REGULAR >= 3",
        options: [
            { id: 1, text: "Retards fréquents" },
            { id: 2, text: "Tarifs trop élevés" },
            { id: 3, text: "Véhicules bondés" },
            { id: 4, text: "Horaires inadaptés" },
            { id: 5, text: "Manque de propreté" },
            { id: 6, text: "Problèmes de sécurité" },
            { id: 7, text: "Information voyageurs insuffisante" },
            { 
                id: 8, 
                text: "Autres problèmes", 
                next_if_selected: "PROBLEMS_OTHER"
            }
        ],
        next: "STATION_PREFERENCE"
    },

    // 📝 Autres problèmes
    {
        id: "PROBLEMS_OTHER",
        text: "Précisez les autres problèmes :",
        type: 'freeText',
        condition: "PROBLEMS_REGULAR CONTAINS 8",
        freeTextPlaceholder: "Décrivez les problèmes...",
        next: "STATION_PREFERENCE"
    },

    // 🚏 Préférence de gare/station
    {
        id: "STATION_PREFERENCE",
        text: "Quelle est votre gare ou station la plus fréquemment utilisée ?",
        type: 'station',
        condition: "TRANSPORT_FREQUENCY <= 4", // Utilisateurs réguliers à occasionnels
        next: "OCCASIONAL_USER_QUESTIONS"
    },

    // 🔄 Questions pour utilisateurs occasionnels
    {
        id: "OCCASIONAL_USER_QUESTIONS",
        text: "Dans quelles situations utilisez-vous principalement les transports ?",
        type: 'multipleChoice',
        condition: "TRANSPORT_FREQUENCY == 3 OR TRANSPORT_FREQUENCY == 4",
        options: [
            { id: 1, text: "Sorties loisirs/culture" },
            { id: 2, text: "Rendez-vous médicaux" },
            { id: 3, text: "Shopping/courses" },
            { id: 4, text: "Visites famille/amis" },
            { id: 5, text: "Déplacements professionnels ponctuels" },
            { id: 6, text: "Évènements spéciaux" },
            { 
                id: 7, 
                text: "Autres situations", 
                next_if_selected: "OCCASIONS_OTHER"
            }
        ],
        next: "RARE_USER_QUESTIONS"
    },

    // 📝 Autres occasions d'utilisation
    {
        id: "OCCASIONS_OTHER",
        text: "Précisez les autres situations :",
        type: 'freeText',
        condition: "OCCASIONAL_USER_QUESTIONS CONTAINS 7",
        freeTextPlaceholder: "Dans quelles situations...",
        next: "RARE_USER_QUESTIONS"
    },

    // 🔍 Questions pour utilisateurs rares
    {
        id: "RARE_USER_QUESTIONS",
        text: "Qu'est-ce qui pourrait vous inciter à utiliser davantage les transports en commun ?",
        type: 'multipleChoice',
        condition: "TRANSPORT_FREQUENCY == 5",
        options: [
            { id: 1, text: "Tarifs plus attractifs" },
            { id: 2, text: "Meilleure desserte de ma zone" },
            { id: 3, text: "Horaires plus étendus" },
            { id: 4, text: "Plus de fréquence" },
            { id: 5, text: "Meilleur confort" },
            { id: 6, text: "Plus de fiabilité" },
            { id: 7, text: "Meilleure information" },
            { 
                id: 8, 
                text: "Autres améliorations", 
                next_if_selected: "INCENTIVES_OTHER"
            }
        ],
        next: "IMPROVEMENT_SUGGESTIONS"
    },

    // 📝 Autres incitations
    {
        id: "INCENTIVES_OTHER",
        text: "Précisez les autres améliorations :",
        type: 'freeText',
        condition: "RARE_USER_QUESTIONS CONTAINS 8",
        freeTextPlaceholder: "Quelles améliorations...",
        next: "IMPROVEMENT_SUGGESTIONS"
    },

    // 💡 Suggestions d'amélioration (question finale commune)
    {
        id: "IMPROVEMENT_SUGGESTIONS",
        text: "Avez-vous des suggestions pour améliorer les transports en commun dans votre région ?",
        type: 'freeText',
        freeTextPlaceholder: "Vos suggestions et commentaires...",
        next: "CONTACT_INFO"
    },

    // 📧 Informations de contact (optionnel)
    {
        id: "CONTACT_INFO",
        text: "Souhaitez-vous être recontacté(e) pour participer à d'autres enquêtes ?",
        type: 'singleChoice',
        options: [
            { 
                id: 1, 
                text: "Oui, voici mon email", 
                next_if_selected: "EMAIL_INPUT"
            },
            { id: 2, text: "Non merci", next: "FINAL_THANKS" }
        ]
    },

    // 📨 Saisie email
    {
        id: "EMAIL_INPUT",
        text: "Votre adresse email :",
        type: 'freeText',
        validation: 'email',
        condition: "CONTACT_INFO == 1",
        freeTextPlaceholder: "votre@email.com",
        next: "FINAL_THANKS"
    },

    // 🙏 Remerciements finaux (avec texte conditionnel selon le profil)
    {
        id: "FINAL_THANKS",
        conditionalText: {
            condition: "STUDENT_CHECK == 1",
            routes: [
                { 
                    value: "STUDENT_CHECK == 1", 
                    text: "Merci pour votre participation ! Vos réponses d'étudiant(e) sont très précieuses pour améliorer les transports. Bonne continuation dans vos études ! 🎓" 
                }
            ]
        },
        text: "Merci beaucoup pour le temps consacré à cette enquête ! Vos réponses nous aideront à améliorer les transports en commun. 🚌✨",
        type: 'text'
        // Pas de next = fin du questionnaire
    }
];

// 🎯 Configuration du questionnaire
export const surveyConfig = {
    title: "🧪 ENQUÊTE TEST - Conditions Complexes",
    description: "Questionnaire de démonstration avec logique conditionnelle avancée",
    startQuestionId: 'START',
    version: '2.0-test'
};

/* 
📋 DOCUMENTATION DES CONDITIONS TESTÉES :

✅ CONDITIONS TESTÉES DANS CE QUESTIONNAIRE :

1. **Conditions simples** : `START >= 16`, `AGE_GROUP == 1`
2. **Conditions composées** : `AGE_GROUP == 1 AND STUDENT_CHECK == 1`
3. **Conditions multiples** : `WORK_STATUS == 1 OR WORK_STATUS == 2 OR WORK_STATUS == 5`
4. **Conditions avec CONTAINS** : `STUDIES_TYPE CONTAINS 6`
5. **Conditions avec IN** : `TRANSPORT_FREQUENCY IN [1,2]`
6. **Conditions avec IS NOT NULL** : `WORK_STATUS IS NOT NULL`
7. **conditionalNext** : Navigation multiple selon réponses
8. **conditionalText** : Texte dynamique selon profil
9. **next_if_selected** : Précisions automatiques
10. **fallbackNext** : Navigation par défaut
11. **Fin de questionnaire** : Questions sans `next`
12. **Validation** : `numeric`, `email`
13. **Types de questions** : `number`, `singleChoice`, `multipleChoice`, `freeText`, `text`, `commune`, `station`

🎯 SCÉNARIOS DE TEST POSSIBLES :
- Mineur (< 16 ans) → Fin prématurée
- Étudiant 18-25 ans → Parcours études
- Actif 26-50 ans → Parcours professionnel  
- Retraité 51+ ans → Parcours retraite
- Utilisateur régulier → Questions satisfaction
- Non-utilisateur → Questions motivation
*/