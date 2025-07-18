// ContestantCard Component for Monetized Voting App
// This component displays individual contestant information in a card format

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Calendar, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getBadge = (rank) => {
  if (rank === 1) {
    return (
      <span className="absolute top-9 left-9 z-10 flex items-center justify-center w-8 h-8 bg-yellow-400 text-white text-xl font-bold rounded-full shadow-md text-xs">
        🥇
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="absolute top-9 left-9 z-10 flex items-center justify-center w-8 h-8 bg-gray-400 text-white text-xl font-bold rounded-full shadow-md text-xs">
        🥈
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="absolute top-9 left-9 z-10 flex items-center justify-center w-8 h-8 bg-orange-400 text-white text-xl font-bold rounded-full shadow-md text-xs">
        🥉
      </span>
    );
  }
  return null;
};

const ContestantCard = ({ contestant, rank }) => {
  const navigate = useNavigate();

  // Handle card click to navigate to voting page
  const handleCardClick = () => {
    navigate(`/vote/${contestant.id}`, { 
      state: { contestant } 
    });
  };

  // Format vote count with commas
  const formatVoteCount = (count) => {
    return new Intl.NumberFormat('en-NG').format(count);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className={`card cursor-pointer group relative ${contestant.evicted ? 'pointer-events-none opacity-80' : ''}`}
      onClick={handleCardClick}
    >
      {/* Top 3 Badge (global, not search) */}
      {(!contestant.evicted && rank) ? getBadge(rank) : null}

      {/* Contestant Image */}
      <div className="relative mb-4">
        <img
          src={contestant.imageUrl}
          alt={contestant.name}
          className="w-full h-48 object-cover rounded-lg group-hover:brightness-110 transition-all duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face';
          }}
        />
        
        {/* Evicted Overlay */}
        {contestant.evicted && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 rounded-lg animate-fade-shake">
            <span className="text-4xl font-extrabold text-red-600 drop-shadow-lg rotate-[-18deg] tracking-widest select-none">
              Evicted
            </span>
          </div>
        )}

        {/* Vote Count Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
          <Heart className="w-4 h-4 text-red-500 fill-current" />
          <span className="font-semibold text-gray-800">
            {formatVoteCount(contestant.voteCount)}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          {contestant.category}
        </div>
      </div>

      {/* Contestant Information */}
      <div className="space-y-3">
        {/* Name */}
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {contestant.name}
        </h3>

        {/* Bio */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {contestant.bio}
        </p>

        {/* Contestant Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{contestant.location}</span>
          </div>
          
          {/* <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{contestant.age} years old</span>
          </div> */}
        </div>

        {/* Vote Button */}
        <motion.button
          whileHover={!contestant.evicted ? { scale: 1.05 } : {}}
          whileTap={!contestant.evicted ? { scale: 0.95 } : {}}
          className={`btn-primary w-full mt-4 flex items-center justify-center gap-2 ${contestant.evicted ? 'bg-gray-400 cursor-not-allowed opacity-60' : ''}`}
          disabled={contestant.evicted}
        >
          <Award className="w-4 h-4" />
          {contestant.evicted ? 'Evicted' : 'Vote Now'}
        </motion.button>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
    </motion.div>
  );
};

export default ContestantCard; 