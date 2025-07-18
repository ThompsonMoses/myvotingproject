import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  UserPlus, 
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { getContestants, deleteContestant, updateContestant, addContestant } from '../config/firebase';

const ContestantManagement = () => {
  const navigate = useNavigate();
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, evicted
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    age: '',
    location: '',
    category: '',
    imageUrl: ''
  });

  // Fetch contestants on component mount
  useEffect(() => {
    fetchContestants();
  }, []);

  const fetchContestants = async () => {
    try {
      setLoading(true);
      const fetchedContestants = await getContestants();
      setContestants(fetchedContestants);
    } catch (error) {
      console.error('Error fetching contestants:', error);
      toast.error('Failed to load contestants');
    } finally {
      setLoading(false);
    }
  };

  // Filter contestants based on search and status
  const filteredContestants = contestants.filter(contestant => {
    const matchesSearch = contestant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contestant.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && !contestant.evicted) ||
                         (filterStatus === 'evicted' && contestant.evicted);
    return matchesSearch && matchesStatus;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      age: '',
      location: '',
      category: '',
      imageUrl: ''
    });
  };

  // Open add modal
  const handleAddContestant = () => {
    resetForm();
    setShowAddModal(true);
  };

  // Open edit modal
  const handleEditContestant = (contestant) => {
    setSelectedContestant(contestant);
    setFormData({
      name: contestant.name || '',
      bio: contestant.bio || '',
      age: contestant.age || '',
      location: contestant.location || '',
      category: contestant.category || '',
      imageUrl: contestant.imageUrl || ''
    });
    setShowEditModal(true);
  };

  // Open delete modal
  const handleDeleteContestant = (contestant) => {
    setSelectedContestant(contestant);
    setShowDeleteModal(true);
  };

  // Toggle evicted status
  const handleToggleEvicted = async (contestant) => {
    try {
      const updatedContestant = {
        ...contestant,
        evicted: !contestant.evicted
      };
      await updateContestant(contestant.id, updatedContestant);
      await fetchContestants(); // Refresh the list
      toast.success(`${contestant.name} ${updatedContestant.evicted ? 'marked as evicted' : 'marked as active'}`);
    } catch (error) {
      console.error('Error updating contestant:', error);
      toast.error('Failed to update contestant status');
    }
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    try {
      if (showAddModal) {
        // Add new contestant
        await addContestant(formData);
        toast.success('Contestant added successfully');
      } else {
        // Update existing contestant
        await updateContestant(selectedContestant.id, {
          ...selectedContestant,
          ...formData
        });
        toast.success('Contestant updated successfully');
      }
      
      await fetchContestants(); // Refresh the list
      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving contestant:', error);
      toast.error('Failed to save contestant');
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await deleteContestant(selectedContestant.id);
      await fetchContestants();
      toast.success('Contestant deleted successfully');
      setShowDeleteModal(false);
      setSelectedContestant(null);
    } catch (error) {
      console.error('Error deleting contestant:', error);
      toast.error('Failed to delete contestant');
    }
  };

  if (loading) {
    return <LoadingSpinner size="xl" text="Loading contestants..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Admin
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contestant Management</h1>
                <p className="text-sm text-gray-500">Manage all contestants in the competition</p>
              </div>
            </div>
            
            <button
              onClick={handleAddContestant}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Contestant
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search contestants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Contestants</option>
                <option value="active">Active Only</option>
                <option value="evicted">Evicted Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contestants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredContestants.map((contestant, index) => (
              <motion.div
                key={contestant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Contestant Image */}
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={contestant.imageUrl}
                    alt={contestant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face';
                    }}
                  />
                  
                  {/* Evicted Overlay */}
                  {contestant.evicted && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-2xl font-bold text-red-500 rotate-[-15deg]">
                        EVICTED
                      </span>
                    </div>
                  )}

                  {/* Vote Count Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 shadow-lg">
                    <span className="font-semibold text-gray-800">
                      {contestant.voteCount?.toLocaleString() || 0} votes
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {contestant.evicted ? (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                        Evicted
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Contestant Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {contestant.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {contestant.bio}
                  </p>
                  
                  <div className="space-y-1 mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Age:</span> {contestant.age} years
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Location:</span> {contestant.location}
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Category:</span> {contestant.category}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditContestant(contestant)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => handleToggleEvicted(contestant)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                        contestant.evicted
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      {contestant.evicted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Activate
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Evict
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleDeleteContestant(contestant)}
                      className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredContestants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No contestants found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first contestant'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={handleAddContestant}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add First Contestant
              </button>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {showAddModal ? 'Add New Contestant' : 'Edit Contestant'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter contestant name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter contestant bio"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Location"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Music, Dance, Comedy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {showAddModal ? 'Add Contestant' : 'Update Contestant'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Contestant
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <strong>{selectedContestant?.name}</strong>? 
                  This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContestantManagement; 