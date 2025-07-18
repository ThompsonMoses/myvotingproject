// Firebase Configuration for Monetized Voting App
// This file handles Firebase initialization and Firestore database setup

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, updateDoc, increment, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 🔥 Firebase Configuration
// Replace these values with your actual Firebase project configuration
// You can get these from your Firebase Console: https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "AIzaSyCLSyktUXjukj-6ITU3GKm1qdwCyO6YwtU",
  authDomain: "monetizedvotingapp.firebaseapp.com",
  projectId: "monetizedvotingapp",
  storageBucket: "monetizedvotingapp.firebasestorage.app",
  messagingSenderId: "899305869524",
  appId: "1:899305869524:web:24b385ea46aa7ebb96eb41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication
export const auth = getAuth(app);
// Initialize Firestore Database
export const db = getFirestore(app);

// 📊 Firestore Collections
export const CONTESTANTS_COLLECTION = 'contestants';
export const VOTES_COLLECTION = 'votes';

// 🎯 Database Helper Functions

/**
 * Get all contestants from Firestore
 * @returns {Promise<Array>} Array of contestant objects
 */
export const getContestants = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CONTESTANTS_COLLECTION));
    const contestants = [];
    
    querySnapshot.forEach((doc) => {
      contestants.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return contestants;
  } catch (error) {
    console.error('Error fetching contestants:', error);
    throw error;
  }
};

/**
 * Update contestant vote count in Firestore
 * @param {string} contestantId - The contestant's document ID
 * @param {number} voteCount - Number of votes to add
 * @returns {Promise<void>}
 */
export const updateContestantVotes = async (contestantId, voteCount) => {
  try {
    const contestantRef = doc(db, CONTESTANTS_COLLECTION, contestantId);
    await updateDoc(contestantRef, {
      voteCount: increment(voteCount)
    });
  } catch (error) {
    console.error('Error updating contestant votes:', error);
    throw error;
  }
};

/**
 * Record a vote transaction in Firestore
 * @param {Object} voteData - Vote transaction data
 * @returns {Promise<void>}
 */
export const recordVoteTransaction = async (voteData) => {
  try {
    const voteRef = doc(collection(db, VOTES_COLLECTION));
    await setDoc(voteRef, {
      ...voteData,
      timestamp: new Date(),
      status: 'completed'
    });
  } catch (error) {
    console.error('Error recording vote transaction:', error);
    throw error;
  }
};

/**
 * Add a new contestant to Firestore
 * @param {Object} contestantData - Contestant data object
 * @returns {Promise<string>} The new contestant's document ID
 */
export const addContestant = async (contestantData) => {
  try {
    const docRef = await addDoc(collection(db, CONTESTANTS_COLLECTION), {
      ...contestantData,
      voteCount: 0,
      evicted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding contestant:', error);
    throw error;
  }
};

/**
 * Update an existing contestant in Firestore
 * @param {string} contestantId - The contestant's document ID
 * @param {Object} contestantData - Updated contestant data
 * @returns {Promise<void>}
 */
export const updateContestant = async (contestantId, contestantData) => {
  try {
    const contestantRef = doc(db, CONTESTANTS_COLLECTION, contestantId);
    await updateDoc(contestantRef, {
      ...contestantData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating contestant:', error);
    throw error;
  }
};

/**
 * Delete a contestant from Firestore
 * @param {string} contestantId - The contestant's document ID
 * @returns {Promise<void>}
 */
export const deleteContestant = async (contestantId) => {
  try {
    const contestantRef = doc(db, CONTESTANTS_COLLECTION, contestantId);
    await deleteDoc(contestantRef);
  } catch (error) {
    console.error('Error deleting contestant:', error);
    throw error;
  }
};

export default app; 