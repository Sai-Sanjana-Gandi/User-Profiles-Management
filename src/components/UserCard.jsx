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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="card group hover:shadow-lg transition-all duration-300"
    >
      {/* User Info */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative">
          <img
            src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=150`}
            alt={`${user.name}'s profile`}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=150`;
            }}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {user.role}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Briefcase className="w-4 h-4 text-gray-400" />
          <span className="truncate">{user.role}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleEdit}
          className="flex-1 flex items-center justify-center space-x-2 bg-primary-50 hover:bg-primary-100 text-primary-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200"
          aria-label={`Edit ${user.name}`}
        >
          <Edit className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 rounded-lg transition-colors duration-200"
          aria-label={`Delete ${user.name}`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>

      {/* Created/Updated Info */}
      {(user.createdAt || user.updatedAt) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            {user.updatedAt ? 'Updated' : 'Created'}:{' '}
            {new Date(user.updatedAt || user.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </motion.div>
  );
};
