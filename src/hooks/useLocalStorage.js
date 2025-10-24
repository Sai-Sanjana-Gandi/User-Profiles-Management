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

  // Initialize with sample data for testing
  useEffect(() => {
    if (users.length === 0) {
      const sampleUsers = [
        {
          id: '1',
          name: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'Software Engineer',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Jane Smith',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@example.com',
          role: 'Product Manager',
          profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Mike Johnson',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@example.com',
          role: 'UX Designer',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          createdAt: new Date().toISOString(),
        },
      ];
      setUsers(sampleUsers);
    }
  }, [users.length, setUsers]);

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
