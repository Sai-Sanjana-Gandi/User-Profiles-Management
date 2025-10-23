import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Users, AlertCircle } from 'lucide-react';
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async (userData) => {
    setIsSubmitting(true);
    try {
      await addUser(userData);
      setIsAddModalOpen(false);
      success('User Added', `${userData.name} has been successfully added to the system.`);
    } catch (error) {
      console.error('Failed to add user:', error);
      showError('Failed to Add User', 'There was an error adding the user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userData) => {
    setIsSubmitting(true);
    try {
      await updateUser(selectedUser.id, userData);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      success('User Updated', `${userData.name} has been successfully updated.`);
    } catch (error) {
      console.error('Failed to update user:', error);
      showError('Failed to Update User', 'There was an error updating the user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const userName = selectedUser.name;
      await deleteUser(selectedUser.id);
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      success('User Deleted', `${userName} has been successfully removed from the system.`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      showError('Failed to Delete User', 'There was an error deleting the user. Please try again.');
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
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 rounded-full blur-3xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Translucent Header */}
      <div className="relative navbar-translucent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <motion.div 
              className="mb-6 sm:mb-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-black rainbow-text animate-slide-in-up">
                User Profiles
              </h1>
              <p className="text-gray-600 mt-2 text-xl animate-slide-in-up" style={{animationDelay: '0.1s'}}>
                ✨ Manage your team members with style ✨
              </p>
            </motion.div>
            <motion.button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary flex items-center space-x-3 hover-lift magnetic-hover animate-bounce-in"
              style={{animationDelay: '0.2s'}}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-6 h-6" />
              <span className="font-bold">Add User</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search Bar */}
        <div className="mb-8 animate-slide-in-up" style={{animationDelay: '0.3s'}}>
          <div className="relative max-w-lg mx-auto">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border-2 border-white/30 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 placeholder-gray-400 hover:bg-white/90 shadow-lg hover:shadow-xl"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
                className="btn-primary text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};
