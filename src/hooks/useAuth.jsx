import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (credentials) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo authentication - in real app, this would be an API call
      if (credentials.email === 'admin@example.com' && credentials.password === 'password123') {
        const userData = {
          id: '1',
          email: credentials.email,
          name: 'Admin User',
          role: 'admin',
          signInTime: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        setIsLoading(false);
        return { success: true };
      } else {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find(u => u.email === credentials.email);
        
        if (existingUser && existingUser.password === credentials.password) {
          const userData = {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            role: existingUser.role || 'user',
            signInTime: new Date().toISOString()
          };
          
          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
          setIsLoading(false);
          return { success: true };
        } else {
          setIsLoading(false);
          return { success: false, error: 'Invalid credentials' };
        }
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Authentication failed' };
    }
  };

  const signUp = async (userData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.email === userData.email);
      
      if (existingUser) {
        setIsLoading(false);
        return { success: false, error: 'Email already exists. Please use a different email.' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        role: 'user',
        createdAt: new Date().toISOString(),
        // Initialize with basic profile structure
        profile: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          dob: '',
          gender: '',
          phone: '',
          altPhone: '',
          address: '',
          pincode: '',
          state: '',
          country: '',
          education: {
            qualification: '',
            college: '',
            gradYear: '',
            skillsPrimary: [],
            skillsSecondary: []
          },
          experience: [
            { domain: '', subDomain: '', years: '' }
          ],
          linkedin: '',
          resume: ''
        }
      };
      
      // Save user to localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto sign in after registration
      const authUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        signInTime: new Date().toISOString()
      };
      
      setUser(authUser);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Registration failed' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const canEditUser = (userEmail) => {
    return user && user.email === userEmail;
  };

  const isEmailTaken = (email, currentUserId = null) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(u => u.email === email && u.id !== currentUserId);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      canEditUser,
      isEmailTaken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
