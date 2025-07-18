#!/usr/bin/env node

/**
 * Setup Script for Monetized Voting Web App
 * This script helps configure Firebase and Paystack credentials
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🏆 Monetized Voting Web App Setup');
console.log('================================\n');

// Function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Function to update file content
function updateFile(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    Object.entries(replacements).forEach(([placeholder, value]) => {
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

async function setup() {
  try {
    console.log('📋 Let\'s configure your app step by step...\n');

    // Firebase Configuration
    console.log('🔥 Firebase Configuration');
    console.log('------------------------');
    
    const firebaseApiKey = await askQuestion('Enter your Firebase API Key: ');
    const firebaseAuthDomain = await askQuestion('Enter your Firebase Auth Domain: ');
    const firebaseProjectId = await askQuestion('Enter your Firebase Project ID: ');
    const firebaseStorageBucket = await askQuestion('Enter your Firebase Storage Bucket: ');
    const firebaseMessagingSenderId = await askQuestion('Enter your Firebase Messaging Sender ID: ');
    const firebaseAppId = await askQuestion('Enter your Firebase App ID: ');

    // Paystack Configuration
    console.log('\n💳 Paystack Configuration');
    console.log('-------------------------');
    
    const paystackPublicKey = await askQuestion('Enter your Paystack Public Key: ');

    // Update Firebase config
    console.log('\n📝 Updating configuration files...');
    
    updateFile('src/config/firebase.js', {
      'your-api-key-here': firebaseApiKey,
      'your-project-id.firebaseapp.com': firebaseAuthDomain,
      'your-project-id': firebaseProjectId,
      'your-project-id.appspot.com': firebaseStorageBucket,
      '123456789': firebaseMessagingSenderId,
      'your-app-id': firebaseAppId
    });

    // Update Paystack config
    updateFile('src/utils/paystack.js', {
      'pk_test_your_paystack_public_key_here': paystackPublicKey
    });

    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run "npm run dev" to start the development server');
    console.log('2. Open http://localhost:5173 in your browser');
    console.log('3. Test the payment flow with Paystack test cards');
    console.log('4. Check the README.md for detailed documentation');
    
    console.log('\n🔧 Important Notes:');
    console.log('- Make sure Firestore Database is enabled in your Firebase project');
    console.log('- Set up proper Firestore security rules (see README.md)');
    console.log('- Use test mode for development, switch to live mode for production');
    console.log('- Keep your API keys secure and never commit them to version control');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

// Run setup
setup(); 