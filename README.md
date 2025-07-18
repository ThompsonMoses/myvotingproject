<<<<<<< HEAD
# myvotingproject
=======
# 🏆 Monetized Voting Web App MVP

A modern React web application where users can vote for contestants by paying for votes. Built with React, Firebase, Paystack, and Tailwind CSS.

## ✨ Features

### 🎭 Contestant Management

- **Grid Layout**: Beautiful card-based display of all contestants
- **Real-time Vote Counts**: Live updates of vote totals for each contestant
- **Rich Contestant Info**: Photos, bios, age, location, and categories
- **Responsive Design**: Works perfectly on mobile and desktop

### 💳 Payment Integration

- **Paystack Integration**: Secure payment processing
- **Dynamic Pricing**: Real-time calculation of vote costs
- **Transaction Recording**: Complete audit trail of all votes
- **Email Validation**: Proper form validation and error handling

### 🔥 Firebase Backend

- **Firestore Database**: Real-time data synchronization
- **Vote Tracking**: Automatic vote count updates
- **Transaction Logging**: Complete payment history
- **Auto-seeding**: Dummy data for testing

### 🎨 Modern UI/UX

- **Tailwind CSS**: Beautiful, responsive styling
- **Framer Motion**: Smooth animations and transitions
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Professional loading indicators

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase project
- Paystack account

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd monetized-voting-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Firestore Database
   - Get your Firebase config
   - Update `src/config/firebase.js` with your config

4. **Configure Paystack**

   - Go to [Paystack Dashboard](https://dashboard.paystack.com/)
   - Get your public key
   - Update `src/utils/paystack.js` with your key

5. **Start development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:5173`

## 📁 Project Structure

```
monetized-voting-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ContestantCard.jsx
│   │   └── LoadingSpinner.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   └── Vote.jsx
│   ├── config/             # Configuration files
│   │   └── firebase.js
│   ├── data/               # Data and seeding
│   │   └── seed.js
│   ├── utils/              # Utility functions
│   │   └── paystack.js
│   ├── hooks/              # Custom React hooks
│   ├── App.jsx             # Main app component
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json
├── tailwind.config.js      # Tailwind configuration
└── README.md
```

## 🔧 Configuration

### Firebase Setup

1. **Create Firebase Project**

   ```bash
   # Go to Firebase Console
   # Create new project
   # Enable Firestore Database
   ```

2. **Update Firebase Config**

   ```javascript
   // src/config/firebase.js
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id",
   };
   ```

3. **Firestore Rules**
   ```javascript
   // Allow read access to contestants
   // Allow write access only to vote counts
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /contestants/{contestantId} {
         allow read: if true;
         allow write: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['voteCount']);
       }
       match /votes/{voteId} {
         allow read, write: if true;
       }
     }
   }
   ```

### Paystack Setup

1. **Get API Keys**

   ```bash
   # Go to Paystack Dashboard
   # Get your public key
   # Update src/utils/paystack.js
   ```

2. **Update Paystack Config**
   ```javascript
   // src/utils/paystack.js
   const PAYSTACK_PUBLIC_KEY = "pk_test_your_public_key_here";
   ```

## 🎯 Usage

### For Users

1. **Browse Contestants**: View all contestants on the home page
2. **Select Contestant**: Click on any contestant card
3. **Enter Details**: Provide email and number of votes
4. **Make Payment**: Complete payment via Paystack
5. **Vote Recorded**: Vote count updates automatically

### For Developers

1. **Add Contestants**: Modify `src/data/seed.js`
2. **Customize Styling**: Update `tailwind.config.js`
3. **Modify Pricing**: Change `PRICE_PER_VOTE` in paystack.js
4. **Add Features**: Extend components as needed

## 🧪 Testing

### Test Payment Flow

1. Use Paystack test cards:
   - **Card Number**: 4084 0840 8408 4081
   - **Expiry**: Any future date
   - **CVV**: Any 3 digits
   - **PIN**: Any 4 digits

### Test Data

- The app automatically seeds with 6 dummy contestants
- Each contestant has realistic data and images
- Vote counts start at 0

## 🚀 Deployment

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init hosting

# Build the app
npm run build

# Deploy
firebase deploy
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 🔒 Security Considerations

- **Firebase Rules**: Configure proper Firestore security rules
- **Paystack Webhooks**: Implement webhook verification for production
- **Environment Variables**: Use `.env` files for sensitive data
- **Input Validation**: All user inputs are validated
- **Rate Limiting**: Consider implementing rate limiting for votes

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Error**

   - Check Firebase config
   - Ensure Firestore is enabled
   - Verify security rules

2. **Paystack Payment Fails**

   - Check public key configuration
   - Verify test mode settings
   - Check browser console for errors

3. **Images Not Loading**
   - Check image URLs in seed data
   - Verify CORS settings
   - Check network connectivity

### Debug Mode

```javascript
// Enable debug logging
localStorage.setItem("debug", "true");
```

## 📈 Future Enhancements

- [ ] Real-time vote updates with WebSockets
- [ ] Admin dashboard for contestant management
- [ ] Social media sharing integration
- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Progressive Web App (PWA) features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Review Firebase and Paystack documentation
3. Open an issue on GitHub
4. Contact the development team

---

**Built with ❤️ using React, Firebase, and Paystack**
>>>>>>> 8de369b (first commit)
