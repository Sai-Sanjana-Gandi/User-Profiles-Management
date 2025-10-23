import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Initial value if no data exists
 * @returns {[any, function]} - [value, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Custom hook for managing users in localStorage
 * @returns {object} - { users, addUser, updateUser, deleteUser, loading, error }
 */
export const useUsers = () => {
  const [users, setUsers] = useLocalStorage('users', []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // No need to initialize with sample data - users will be created through sign-up

  const addUser = (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString(),
      };
      
      setUsers(prevUsers => [...prevUsers, newUser]);
      return newUser;
    } catch (err) {
      setError('Failed to add user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (id, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id 
            ? { ...user, ...userData, updatedAt: new Date().toISOString() }
            : user
        )
      );
    } catch (err) {
      setError('Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = (id) => {
    setLoading(true);
    setError(null);
    
    try {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    } catch (err) {
      setError('Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    addUser,
    updateUser,
    deleteUser,
    loading,
    error,
  };
};
