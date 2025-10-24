import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, AlertCircle, X } from 'lucide-react';
import { useUsers } from '../hooks/useLocalStorage';
import { UserCard } from '../components/UserCard';
import { UserForm } from '../components/UserForm';
import { Modal, ConfirmModal } from '../components/Modal';
import { Loader, DashboardSkeleton } from '../components/Loader';
import { useToast } from '../components/Toast';

/**
 * Dashboard page displaying all users
 */
export const Dashboard = () => {
  const { users, addUser, updateUser, deleteUser, loading, error } = useUsers();
  const { success, error: showError } = useToast();

  // State management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Log users for debugging
  useEffect(() => {
    if (users) {
      console.log('Users loaded:', users);
    }
  }, [users]);

  // Filter users based on search term
  const filteredUsers = React.useMemo(() => {
    if (!users) return [];
    
    if (!searchTerm.trim()) return users;
    
    const searchLower = searchTerm.toLowerCase();
    return users.filter(user => {
      try {
        if (!user) return false;
        
        return (
          (user.name && user.name.toLowerCase().includes(searchLower)) ||
          (user.firstName && user.firstName.toLowerCase().includes(searchLower)) ||
          (user.lastName && user.lastName.toLowerCase().includes(searchLower)) ||
          (user.email && user.email.toLowerCase().includes(searchLower)) ||
          (user.role && user.role.toLowerCase().includes(searchLower)) ||
          (user.phone && user.phone.toString().toLowerCase().includes(searchLower)) ||
          (user.address && user.address.toLowerCase().includes(searchLower))
        );
      } catch (err) {
        console.error('Error filtering user:', user, err);
        return false;
      }
    });
  }, [users, searchTerm]);

  const handleAddUser = async (userData) => {
    if (!userData || typeof userData !== 'object') {
      showError('Invalid Input', 'Please provide valid user data');
      return;
    }

    // Create a properly formatted user object
    const newUser = {
      id: Date.now().toString(),
      name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || (userData.education?.qualification || 'User'),
      // Include all other fields from the form
      ...userData,
      // Ensure we have empty objects for nested data if not provided
      education: userData.education || {
        qualification: '',
        college: '',
        gradYear: '',
        skillsPrimary: [],
        skillsSecondary: []
      },
      experience: userData.experience || [{ domain: '', subDomain: '', years: '' }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setIsSubmitting(true);
    try {
      const createdUser = await addUser(newUser);
      if (!createdUser) throw new Error('Failed to create user');
      
      setIsAddModalOpen(false);
      success('User Added', `${newUser.name || 'User'} has been successfully added to the system.`);
    } catch (error) {
      console.error('Failed to add user:', error);
      showError('Failed to Add User', error.message || 'There was an error adding the user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userData) => {
    if (!selectedUser?.id || !userData || typeof userData !== 'object') {
      showError('Invalid Input', 'Please select a valid user to update');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedUser = await updateUser(selectedUser.id, userData);
      if (!updatedUser) throw new Error('Failed to update user');
      
      setIsEditModalOpen(false);
      setSelectedUser(null);
      success('User Updated', `${userData.name || 'User'} has been successfully updated.`);
    } catch (error) {
      console.error('Failed to update user:', error);
      showError('Failed to Update User', error.message || 'There was an error updating the user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser?.id) {
      showError('Invalid User', 'No user selected for deletion');
      return;
    }

    setIsSubmitting(true);
    try {
      const userName = selectedUser.name || 'User';
      const success = await deleteUser(selectedUser.id);
      
      if (!success) throw new Error('Failed to delete user');
      
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      success('User Deleted', `${userName} has been successfully removed from the system.`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      showError('Failed to Delete User', error.message || 'There was an error deleting the user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full opacity-50"></div>
      </div>

       {/* Translucent Navbar */}
       <header className="bg-white/90 backdrop-blur-xl shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Users className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">UserManagement</span>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Analytics
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Team
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Settings
                </a>
              </nav>
            </div>
             <div className="flex items-center">
               <motion.button
                 onClick={() => setIsAddModalOpen(true)}
                 className="ml-3 inline-flex items-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
               >
                 <Plus className="-ml-1 mr-2 h-5 w-5" />
                 Add User
               </motion.button>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              {/* Enhanced Search Bar */}
              <div className="mb-8 animate-slide-in-up" style={{animationDelay: '0.3s'}}>
                <div className="relative max-w-2xl mx-auto">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5 z-10">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users by name, email, role, phone, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/90 backdrop-blur-lg border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 placeholder-gray-400 hover:bg-white shadow-xl hover:shadow-2xl text-gray-700 font-medium"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors duration-200 p-1 rounded-full hover:bg-purple-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <motion.div 
                  className="card hover-lift hover-glow animate-fade-in-scale"
                  style={{animationDelay: '0.4s'}}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gradient">{users.length}</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="card hover-lift hover-glow animate-fade-in-scale"
                  style={{animationDelay: '0.5s'}}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                      <Search className="w-8 h-8 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                      <p className="text-3xl font-bold text-gradient">{filteredUsers.length}</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="card hover-lift hover-glow animate-fade-in-scale"
                  style={{animationDelay: '0.6s'}}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {Math.round((filteredUsers.length / users.length) * 100) || 0}%
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Match Rate</p>
                      <p className="text-3xl font-bold text-gradient">
                        {searchTerm ? 'Filtered' : 'All'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Users Grid */}
              {loading ? (
                <DashboardSkeleton />
              ) : filteredUsers.length === 0 ? (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
                  >
                    <Users className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {searchTerm ? 'No users found' : 'No users yet'}
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    {searchTerm 
                      ? 'Try adjusting your search terms' 
                      : 'Get started by adding your first user'
                    }
                  </p>
                   {!searchTerm && (
                     <motion.button
                       onClick={() => setIsAddModalOpen(true)}
                       className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                     >
                       <Plus className="-ml-1 mr-2 h-5 w-5" />
                       Add First User
                     </motion.button>
                   )}
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <AnimatePresence>
                    {filteredUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: index * 0.1,
                          type: "spring", 
                          stiffness: 100 
                        }}
                      >
                        <UserCard
                          user={user}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
        title="Add New User"
        size="lg"
      >
        <UserForm
          onSubmit={handleAddUser}
          onCancel={handleCloseModals}
          isLoading={isSubmitting}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        title="Edit User"
        size="lg"
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleUpdateUser}
          onCancel={handleCloseModals}
          isLoading={isSubmitting}
        />
      </Modal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name || 'this user'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};
