import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Mail, Briefcase } from 'lucide-react';

/**
 * User card component displaying user information
 * @param {object} props - Component props
 * @param {object} props.user - User data
 * @param {function} props.onEdit - Function to handle edit action
 * @param {function} props.onDelete - Function to handle delete action
 */
export const UserCard = ({ user, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(user);
  };

  const handleDelete = () => {
    onDelete(user);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group transition-all duration-500 rounded-2xl p-6 bg-white/95 backdrop-blur-md border border-white/30 shadow-2xl hover:shadow-3xl"
    >
      {/* User Info */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <motion.img
            src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=150`}
            alt={`${user.name}'s profile`}
            className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-lg"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=150`;
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {user.name}
          </h3>
          <p className="text-sm text-gray-600 truncate font-medium">
            {user.role}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3 text-sm">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <span className="truncate font-medium text-gray-700">{user.email}</span>
        </div>
        <div className="flex items-center space-x-3 text-sm">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <span className="truncate font-medium text-gray-700">{user.role}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <motion.button
          onClick={handleEdit}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Edit ${user.name}`}
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </motion.button>
        <motion.button
          onClick={handleDelete}
          className="flex-1 flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label={`Delete ${user.name}`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </motion.button>
      </div>

      {/* Created/Updated Info */}
      {(user.createdAt || user.updatedAt) && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 font-medium">
            {user.updatedAt ? 'Updated' : 'Created'}:{' '}
            {new Date(user.updatedAt || user.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </motion.div>
  );
};
