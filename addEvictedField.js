// addEvictedField.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Replace this with your real config or import from firebase.js
const firebaseConfig = {
    apiKey: "AIzaSyCLSyktUXjukj-6ITU3GKm1qdwCyO6YwtU",
    authDomain: "monetizedvotingapp.firebaseapp.com",
    projectId: "monetizedvotingapp",
    storageBucket: "monetizedvotingapp.firebasestorage.app",
    messagingSenderId: "899305869524",
    appId: "1:899305869524:web:24b385ea46aa7ebb96eb41"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addEvictedField() {
  const snapshot = await getDocs(collection(db, 'contestants'));

  const updates = snapshot.docs.map(async (docSnap) => {
    const ref = doc(db, 'contestants', docSnap.id);
    return updateDoc(ref, {
      evicted: false
    });
  });

  await Promise.all(updates);
  console.log('✅ All contestants now have evicted: false');
}

addEvictedField().catch((err) => {
  console.error('❌ Error updating documents:', err);
});
