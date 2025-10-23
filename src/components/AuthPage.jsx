import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { LogIn, UserPlus } from 'lucide-react';

/**
 * AuthPage component that handles both sign-in and sign-up
 */
export const AuthPage = ({ onSignIn, onSignUp, isLoading }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen animated-bg">
      {/* Auth Toggle */}
      <div className="absolute top-8 right-8 z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/20"
        >
          <div className="flex space-x-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                !isSignUp
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isSignUp
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Auth Form */}
      <motion.div
        key={isSignUp ? 'signup' : 'signin'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {isSignUp ? (
          <SignUp onSignUp={onSignUp} isLoading={isLoading} />
        ) : (
          <SignIn onSignIn={onSignIn} isLoading={isLoading} />
        )}
      </motion.div>
    </div>
  );
};
