<template>
    <div class="admin-dashboard-root">
      <button class="btn-signin" @click="showSignInModal = true">
        Connexion Admin
      </button>
  
      <!-- Sign In Modal -->
      <div v-if="showSignInModal" class="modal">
        <div class="modal-content signin-modal">
          <button class="close" @click="showSignInModal = false">&times;</button>
          <h2>Connexion Admin</h2>
          <input
            v-model="password"
            type="password"
            placeholder="Entrez le mot de passe"
            class="form-control"
          />
          <button @click="signIn" class="btn-signin">Se connecter</button>
        </div>
      </div>
  
      <!-- Admin Dashboard Modal -->
      <div v-if="showAdminDashboard" class="modal">
        <div class="modal-content admin-dashboard">
          <button class="close" @click="showAdminDashboard = false">
            &times;
          </button>
          <h2>Tableau de Bord Admin</h2>
          <div class="dashboard-content">
            <div class="dashboard-card total">
              <h3>Total des Enquêtes</h3>
              <p class="big-number">{{ totalSurveys }}</p>
            </div>
            <div class="dashboard-card">
              <h3>Enquêtes par Enquêteur</h3>
              <ul>
                <li v-for="(count, name) in surveysByEnqueteur" :key="name">
                  <span>{{ name }}</span>
                  <span class="count">{{ count }}</span>
                </li>
              </ul>
            </div>
  
          </div>
          <button @click="downloadData" class="btn-download">
            Télécharger les Données
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { collection, getDocs } from "firebase/firestore";
  import { db } from "../firebaseConfig";
  import * as XLSX from "xlsx";
  import { templateSurveyQuestions as surveyQuestions } from "./surveyQuestions.js";
  
  const props = defineProps({
    activeFirebaseCollectionName: {
      type: String,
      required: true,
    },
  });
  
  const showSignInModal = ref(false);
  const showAdminDashboard = ref(false);
  const password = ref("");
  const surveysByEnqueteur = ref({});
  const totalSurveys = ref(0);
  
  const surveyCollectionRef = collection(db, props.activeFirebaseCollectionName);
  
  const signIn = () => {
    if (password.value === "admin123") {
      showSignInModal.value = false;
      fetchAdminData();
      showAdminDashboard.value = true;
    } else {
      alert("Mot de passe incorrect");
    }
  };
  
  const fetchAdminData = async () => {
    try {
      const querySnapshot = await getDocs(surveyCollectionRef);
      const surveys = querySnapshot.docs.map((doc) => doc.data());
  
      totalSurveys.value = surveys.length;
  
      surveysByEnqueteur.value = surveys.reduce((acc, survey) => {
        acc[survey.ENQUETEUR] = (acc[survey.ENQUETEUR] || 0) + 1;
        return acc;
      }, {});
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };
  
  const downloadData = async () => {
    try {
      const querySnapshot = await getDocs(surveyCollectionRef);
      const rawData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        firestore_id: doc.id,
      }));
  
      console.log("Raw survey data from Firestore:", rawData);
  
      // Define core headers that should appear first and in this order
      const coreHeaders = [
        "ID_questionnaire",
        "ENQUETEUR",
        "DATE",
        "JOUR",
        "HEURE_DEBUT",
        "HEURE_FIN",
      ];
  
      // Add "POSTE_TRAVAIL" to excludedKeys to prevent it from appearing as a separate column
      const excludedKeys = ["firestore_id", "firebase_timestamp", "S1", "POSTE_TRAVAIL"];
      const surveyQuestionOrder = surveyQuestions.map(q => q.id);
      const posteTravailActualId = "POSTE"; // As specified by user
  
      let allKeys = new Set();
      rawData.forEach(docData => {
        Object.keys(docData).forEach(key => {
          if (!excludedKeys.includes(key)) {
            allKeys.add(key);
          }
        });
      });
  
      // Build the header order
      let orderedHeaders = [...coreHeaders];
      
      // Add the "POSTE" question (if it exists in data and is the designated one)
      if (allKeys.has(posteTravailActualId) && !orderedHeaders.includes(posteTravailActualId)) {
        orderedHeaders.push(posteTravailActualId);
      }
  
      // Add remaining survey questions in their defined order, excluding already added "POSTE"
      surveyQuestionOrder.forEach(questionId => {
        if (allKeys.has(questionId) && !orderedHeaders.includes(questionId) && !excludedKeys.includes(questionId)) {
          orderedHeaders.push(questionId);
          
          // Add related commune fields immediately after
          const codeInseeField = `${questionId}_CODE_INSEE`;
          const communeLibreField = `${questionId}_COMMUNE_LIBRE`;
          if (allKeys.has(codeInseeField) && !orderedHeaders.includes(codeInseeField)) {
            orderedHeaders.push(codeInseeField);
          }
          if (allKeys.has(communeLibreField) && !orderedHeaders.includes(communeLibreField)) {
            orderedHeaders.push(communeLibreField);
          }
        }
      });
  
      // Add any other keys that might exist but weren't in core or surveyQuestionOrder (e.g., old POSTE_TRAVAIL if it's still in some documents)
      // and ensure they are not excluded or already added.
      const remainingKeys = Array.from(allKeys).filter(
        key => !orderedHeaders.includes(key) && !excludedKeys.includes(key)
      ).sort();
      orderedHeaders = [...orderedHeaders, ...remainingKeys];
      
      // Final header list for the sheet
      const finalHeaderOrder = orderedHeaders;
  
      const data = rawData.map((docData) => {
        const processedData = {};
        finalHeaderOrder.forEach(header => {
          if (!excludedKeys.includes(header)) { // Should be redundant as finalHeaderOrder is filtered
            let value = docData[header] !== undefined ? docData[header] : "";
            if (Array.isArray(value)) {
              value = value.join(", ");
            }
            processedData[header] = value;
          }
        });
        return processedData;
      });
  
      console.log("Processed data for Excel:", data);
      console.log("Final Header Order for Excel:", finalHeaderOrder);
  
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data, { header: finalHeaderOrder });
  
      const colWidths = finalHeaderOrder.map(() => ({ wch: 20 }));
      worksheet["!cols"] = colWidths;
      XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Data");
  
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      XLSX.writeFile(workbook, `${props.activeFirebaseCollectionName}_Survey_Data_${timestamp}.xlsx`);
  
      console.log("File downloaded successfully");
    } catch (error) {
      console.error("Error downloading data:", error);
    }
  };
  
  onMounted(() => {
    // Initialization logic if needed
  });
  </script>
  
  <style scoped>
  .admin-dashboard-root {
    background-color: #2a3b63;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
  }
  
  .btn-signin {
    display: block;
    width: auto;
    max-width: 200px;
    margin: 15px auto;
    background: linear-gradient(135deg, rgba(45, 55, 72, 0.4) 0%, rgba(26, 32, 44, 0.6) 100%);
    color: #9ca3af;
    border: 1px solid rgba(255, 255, 255, 0.08);
    cursor: pointer;
    font-size: 10px;
    font-weight: 400;
    padding: 8px 16px;
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: lowercase;
    letter-spacing: 1px;
    text-align: center;
    opacity: 0.5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    position: relative;
    overflow: hidden;
  }
  
  .btn-signin::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s ease;
  }
  
  .btn-signin:hover::before {
    left: 100%;
  }
  
  .btn-signin:hover {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.25) 100%);
    color: #d1d5db;
    opacity: 0.8;
    border-color: rgba(59, 130, 246, 0.2);
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  .btn-signin:active {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.1s ease;
  }
  
  /* Keep the rest of the styles unchanged */
  .btn-download {
    width: 100%;
    padding: 12px;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 10px;
    box-shadow: none;
  }
  
  .btn-download:hover {
    background-color: #2563eb;
  }
  
  .modal {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: #2d3748;
    color: white;
    padding: 25px;
    border-radius: 15px;
    width: auto;
    min-width: 300px;
    max-width: 600px;
    position: relative;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
    margin: 0 auto;
  }
  
  /* Override modal-content when it's also admin-dashboard */
  .modal-content.admin-dashboard {
    padding: 15px !important; /* Slightly more padding for readability */
    min-width: 280px !important;
    max-width: 350px !important; /* Smaller max width for mobile */
    width: 90vw !important; /* Responsive width */
    height: auto !important; /* Force auto height */
    min-height: auto !important; /* Force auto min height */
  }
  
  .modal-content.admin-dashboard h2 {
    margin: 0 0 12px 0 !important; /* Slightly more margin */
    font-size: 18px !important; /* Slightly larger title */
  }
  
  .modal-content.admin-dashboard .dashboard-content {
    gap: 8px !important; /* Slightly more gap */
    margin-bottom: 8px !important; /* Slightly more margin */
  }
  
  .modal-content.admin-dashboard .dashboard-card {
    padding: 10px !important; /* Slightly more padding */
    margin: 0 !important; /* Force no margin */
  }
  
  .modal-content.admin-dashboard .dashboard-card h3 {
    margin: 0 0 4px 0 !important; /* Slightly more margin */
    font-size: 14px !important; /* Slightly larger font */
  }
  
  .modal-content.admin-dashboard .big-number {
    font-size: 24px !important; /* Slightly larger number */
    margin: 0 !important; /* Force no margin */
  }
  
  .modal-content.admin-dashboard .btn-download {
    margin-top: 8px !important; /* Slightly more margin */
    padding: 10px !important; /* Slightly more padding */
    font-size: 14px !important; /* Slightly larger font */
  }
  
  .modal-content.admin-dashboard .dashboard-card ul {
    max-height: 150px !important; /* Smaller max height for mobile */
  }
  
  .modal-content.admin-dashboard .dashboard-card li {
    padding: 8px 0 !important; /* Slightly more padding */
    font-size: 14px !important; /* Ensure readable font size */
  }
  
  /* Force signin modal to be compact */
  .modal-content.signin-modal {
    padding: 15px !important;
    width: auto !important;
    min-width: 300px !important;
    max-width: 320px !important;
    height: auto !important;
    min-height: auto !important;
  }
  
  .signin-modal {
    max-width: 320px !important;
    padding: 0 !important;
  }
  
  .signin-modal h2 {
    margin: 0 0 15px 0 !important;
    font-size: 18px !important;
    text-align: center;
    font-weight: normal;
  }
  
  .signin-modal .form-control,
  .signin-modal .btn-signin {
    width: 100% !important;
    max-width: none !important;
    min-width: 0 !important;
    box-sizing: border-box !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  .signin-modal .form-control {
    margin-bottom: 15px !important;
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
    color: white;
    padding: 12px 16px !important;
    font-size: 14px !important;
    border-radius: 8px !important;
    height: 48px !important;
    display: flex;
    align-items: center;
  }
  
  .signin-modal .form-control::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .signin-modal .btn-signin {
    margin: 0 !important;
    padding: 12px 16px !important;
    background: linear-gradient(135deg, #68d391 0%, #4fd1c7 100%) !important;
    color: white !important;
    border: none !important;
    border-radius: 8px !important;
    font-size: 14px !important;
    font-weight: 600 !important;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease !important;
    height: 48px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 3px 8px rgba(104, 211, 145, 0.3) !important;
    letter-spacing: 0.5px !important;
  }
  
  .signin-modal .btn-signin:hover {
    background: linear-gradient(135deg, #4fd1c7 0%, #68d391 100%) !important; /* Reverse gradient on hover */
    transform: translateY(-2px) !important; /* Lift effect */
    box-shadow: 0 6px 20px rgba(104, 211, 145, 0.4) !important; /* Enhanced glow */
  }
  
  .close {
    position: absolute;
    right: 15px;
    top: 15px;
    width: 24px;
    height: 24px;
    opacity: 0.7;
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s;
  }
  
  .close:hover {
    opacity: 1;
  }
  
  .admin-dashboard {
    width: auto;
    min-width: 500px;
    max-width: 600px;
    padding: 15px 20px;
  }
  
  .admin-dashboard h2 {
    margin: 0 0 15px 0;
    font-size: 20px;
    text-align: center;
    font-weight: normal;
    color: white;
  }
  
  .dashboard-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
  }
  
  .dashboard-card {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 10px;
  }
  
  .dashboard-card h3 {
    margin: 0 0 4px 0;
    font-size: 14px;
    color: #3b82f6;
    font-weight: normal;
  }
  
  .dashboard-card.total {
    text-align: center;
    padding: 8px;
  }
  
  .big-number {
    font-size: 28px;
    font-weight: bold;
    color: #68d391;
    margin: 2px 0;
  }
  
  .dashboard-card ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
  }
  
  .dashboard-card li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .dashboard-card li:last-child {
    border-bottom: none;
  }
  
  .count {
    font-weight: normal;
    color: #68d391;
  }
  
  @media (max-width: 600px) {
    .modal-content {
      margin: 10px;
      width: calc(100% - 20px);
      max-height: 90vh;
    }
  
    .admin-dashboard {
      padding: 15px;
    }
  
    .admin-dashboard h2 {
      font-size: 20px;
      margin-bottom: 15px;
    }
  
    .dashboard-card {
      padding: 12px;
    }
  
    .big-number {
      font-size: 36px;
    }
  
    .btn-download {
      padding: 12px;
      font-size: 14px;
    }
  }
  </style>