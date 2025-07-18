// Home Page Component for Monetized Voting App
// This page displays all contestants in a grid layout

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, TrendingUp } from 'lucide-react';
import ContestantCard from '../components/ContestantCard';
import { FullPageSpinner, CardSkeleton } from '../components/LoadingSpinner';
import { getContestants } from '../config/firebase';
import { seedDatabase } from '../data/seed';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch contestants from Firebase
  useEffect(() => {
    const fetchContestants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to seed database if empty (for first-time setup)
        await seedDatabase();
        
        // Fetch contestants
        const fetchedContestants = await getContestants();
        setContestants(fetchedContestants);
        
        // Calculate total votes
        const total = fetchedContestants.reduce((sum, contestant) => sum + (contestant.voteCount || 0), 0);
        setTotalVotes(total);
        
      } catch (err) {
        console.error('Error fetching contestants:', err);
        setError('Failed to load contestants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContestants();
  }, []);

  // Filter and sort contestants
  const filteredContestants = contestants
    .filter(contestant =>
      contestant.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sort non-evicted contestants by votes (descending)
      if (!a.evicted && !b.evicted) {
        return (b.voteCount || 0) - (a.voteCount || 0);
      }
      // Push evicted contestants to the bottom
      if (a.evicted && !b.evicted) return 1;
      if (!a.evicted && b.evicted) return -1;
      // If both are evicted, sort by votes
      return (b.voteCount || 0) - (a.voteCount || 0);
    });

  // Get top 3 contestant IDs from non-evicted contestants only
  const top3Sorted = [...contestants]
    .filter(contestant => !contestant.evicted)
    .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
    .slice(0, 3);

  const top3Ids = top3Sorted.map(c => c.id);

  // Loading state
  if (loading) {
    return <FullPageSpinner text="Loading contestants..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (contestants.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🎭</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Contestants Found</h2>
          <p className="text-gray-600">There are no contestants available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900 mb-2"
            >
              🏆 Talent Show Voting
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600"
            >
              Vote for your favorite contestants and help them win!
            </motion.p>
          </div>

          {/* Stats */}
          {/* <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg p-6 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{contestants.length}</div>
              <div className="text-sm opacity-90">Contestants</div>
            </div>
            
            <div className="bg-gradient-to-r from-success-500 to-success-600 text-white rounded-lg p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalVotes.toLocaleString()}</div>
              <div className="text-sm opacity-90">Total Votes</div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">₦{totalVotes.toLocaleString()}</div>
              <div className="text-sm opacity-90">Total Value</div>
            </div>
          </motion.div> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <SearchBar className="max-w- border-red" value={searchTerm} onChange={setSearchTerm} />

        {/* Contestants Grid */}
        {filteredContestants.length === 0 && searchTerm.trim() !== '' ? (
          <div className="text-center text-gray-500 py-12">
            <span className="text-lg">{searchTerm} is not a contestant</span>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredContestants.map((contestant, index) => {
              const globalRank = top3Ids.includes(contestant.id)
                ? top3Ids.indexOf(contestant.id) + 1
                : null;
              return (
                <motion.div
                  key={contestant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ContestantCard contestant={contestant} rank={globalRank} />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-gray-500"
        >
          <p>Each vote costs ₦100.00. Vote responsibly!</p>
        </motion.div>
      </main>
    </div>
  );
};

export default Home; 