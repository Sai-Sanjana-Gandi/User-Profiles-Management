/**
 * Validation utilities for user form data
 */

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a string is not empty
 * @param {string} value - Value to validate
 * @returns {boolean} - True if not empty
 */
export const isNotEmpty = (value) => {
  return value && value.trim().length > 0;
};

/**
 * Validates user form data
 * @param {object} userData - User data to validate
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateUserForm = (userData) => {
  const errors = {};

  // Name validation
  if (!isNotEmpty(userData.name)) {
    errors.name = 'Name is required';
  } else if (userData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!isNotEmpty(userData.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(userData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Role validation
  if (!isNotEmpty(userData.role)) {
    errors.role = 'Role is required';
  }

  // Profile picture URL validation (optional)
  if (userData.profilePicture && userData.profilePicture.trim()) {
    try {
      new URL(userData.profilePicture);
    } catch {
      errors.profilePicture = 'Please enter a valid URL';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitizes user input data
 * @param {object} userData - User data to sanitize
 * @returns {object} - Sanitized user data
 */
export const sanitizeUserData = (userData) => {
  return {
    name: userData.name?.trim() || '',
    email: userData.email?.trim().toLowerCase() || '',
    role: userData.role?.trim() || '',
    profilePicture: userData.profilePicture?.trim() || '',
  };
};
