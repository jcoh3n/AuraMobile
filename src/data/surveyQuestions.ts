import { SurveyQuestion } from '../types/survey';

// 🚄 AURAY TRAIN STATION MOBILITY SURVEY
// Questions du sondage de mobilité ferroviaire d'Auray

export const surveyQuestions: SurveyQuestion[] = [
    // Q1 - Raison de la présence en gare (filtre le flux du sondage)
    {
        id: "Q1",
        text: "Quelle est la raison de votre présence en gare ?",
        type: 'singleChoice',
        options: [
            { id: 1, text: "Je vais prendre le train", next: "Q2_MONTANTS_TRAIN" },
            { id: 2, text: "Je vais prendre un car", next: "Q2_MONTANTS_CAR" },
            { id: 3, text: "J'accompagne des voyageurs qui partent / J'attends des voyageurs qui arrivent", next: "Q2_ACCOMPAGNATEURS" },
            { id: 4, text: "Autre raison (promenade, fréquentation commerce, descentes train vers Ville...)", next: "end" }
        ]
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
    startQuestionId: 'Q1',
    firebaseCollection: 'Auray'
}; 