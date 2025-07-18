// Seed Data for Monetized Voting App
// This file contains dummy contestant data for testing and development

import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, CONTESTANTS_COLLECTION } from '../config/firebase';

// 🎭 Dummy Contestant Data
export const dummyContestants = [
  // {
  //   name: "Sarah M Johnson",
  //   bio: "A passionate singer with 5 years of experience in gospel music. Known for her powerful voice and inspiring performances.",
  //   imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
  //   voteCount: 0,
  //   age: 24,
  //   location: "Lagos, Nigeria",
  //   category: "Gospel Music"
  // },
  {
    name: "Michael Chen",
    bio: "Talented dancer specializing in contemporary and hip-hop styles. Winner of multiple dance competitions.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    voteCount: 0,
    age: 22,
    location: "Port Harcourt, Nigeria",
    category: "Dance"
  },
  {
    name: "Aisha Okechukwu",
    bio: "Creative fashion designer with a unique Afrocentric style. Her designs celebrate African culture and modern trends.",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    voteCount: 0,
    age: 26,
    location: "Abuja, Nigeria",
    category: "Fashion Design"
  },
  {
    name: "David Williams",
    bio: "Skilled photographer capturing life's beautiful moments. Specializes in portrait and event photography.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    voteCount: 0,
    age: 28,
    location: "Kano, Nigeria",
    category: "Photography"
  },
  {
    name: "Fatima Hassan",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    voteCount: 0,
    age: 25,
    location: "Ibadan, Nigeria",
    category: "Culinary Arts"
  },
  {
    name: "James Okafor",
    bio: "Versatile actor with experience in theater, film, and television. Known for his emotional depth and versatility.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    voteCount: 0,
    age: 30,
    location: "Enugu, Nigeria",
    category: "Acting"
  }
];

// 🌱 Seed Database Function
/**
 * Add dummy contestants to Firestore database
 * This function should only be run once during initial setup
 */
export const seedDatabase = async () => {
  try {
    // Check if contestants already exist
    const existingContestants = await getDocs(collection(db, CONTESTANTS_COLLECTION));
    
    if (!existingContestants.empty) {
      console.log('Database already seeded with contestants');
      return;
    }

    // Add each contestant to the database
    const promises = dummyContestants.map(contestant => 
      addDoc(collection(db, CONTESTANTS_COLLECTION), contestant)
    );

    await Promise.all(promises);
    console.log('✅ Database seeded successfully with', dummyContestants.length, 'contestants');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// 🧹 Clear Database Function (for testing)
/**
 * Clear all contestants from the database
 * WARNING: This will delete all contestant data
 */
export const clearDatabase = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CONTESTANTS_COLLECTION));
    const deletePromises = querySnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log('🗑️ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
};

export default dummyContestants; 