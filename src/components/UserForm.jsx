import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Linkedin, FileText, Plus, Trash2, Briefcase } from 'lucide-react';

/**
 * Comprehensive User form component for adding/editing users
 * @param {object} props - Component props
 * @param {object} props.user - User data for editing (null for new user)
 * @param {function} props.onSubmit - Function to handle form submission
 * @param {function} props.onCancel - Function to handle form cancellation
 * @param {boolean} props.isLoading - Whether form is in loading state
 */
export const UserForm = ({ user, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
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
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  // Initialize form with user data if editing
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        dob: user.dob || '',
        gender: user.gender || '',
        phone: user.phone || '',
        altPhone: user.altPhone || '',
        address: user.address || '',
        pincode: user.pincode || '',
        state: user.state || '',
        country: user.country || '',
        education: user.education || {
          qualification: '',
          college: '',
          gradYear: '',
          skillsPrimary: [],
          skillsSecondary: []
        },
        experience: user.experience || [{ domain: '', subDomain: '', years: '' }],
        linkedin: user.linkedin || '',
        resume: user.resume || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, ...value } : item
      )
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { domain: '', subDomain: '', years: '' }]
    }));
  };

  const removeExperience = (index) => {
    if (formData.experience.length > 1) {
      setFormData(prev => ({
        ...prev,
        experience: prev.experience.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSkillsChange = (type, skills) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        [type]: skills
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Create user object with name field for compatibility
    const userData = {
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      role: formData.education.qualification || 'Professional',
      updatedAt: new Date().toISOString()
    };

    // Add createdAt if it's a new user
    if (!user) {
      userData.createdAt = new Date().toISOString();
    }

    onSubmit(userData);
  };

  const isFormValid = formData.firstName.trim() && 
    formData.lastName.trim() && 
    formData.email.trim() && 
    formData.phone.trim();

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'education', label: 'Education & Skills', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field ${errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g. John"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field ${errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g. Doe"
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ID *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g. mrnobody@mail.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Birth
                </label>
                <input
                  type="number"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="YYYY"
                  min="1900"
                  max="2024"
                  disabled={isLoading}
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                  disabled={isLoading}
                >
                  <option value="">Select an option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="e.g. 8332883854"
                  disabled={isLoading}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Alternate Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Phone No
                </label>
                <input
                  type="tel"
                  name="altPhone"
                  value={formData.altPhone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. 9876543210"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
                rows="3"
                placeholder="Enter here"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter here"
                  disabled={isLoading}
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domicile State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input-field"
                  disabled={isLoading}
                >
                  <option value="">Select an option</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domicile Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input-field"
                  disabled={isLoading}
                >
                  <option value="">Select an option</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Education & Skills Tab */}
        {activeTab === 'education' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* School/College */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School / College
                </label>
                <input
                  type="text"
                  name="education.college"
                  value={formData.education.college}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Lincoln College"
                  disabled={isLoading}
                />
              </div>

              {/* Highest Degree */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highest degree or equivalent
                </label>
                <input
                  type="text"
                  name="education.qualification"
                  value={formData.education.qualification}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Bachelors in Technology"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <input
                  type="text"
                  name="education.course"
                  value={formData.education.course || ''}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="e.g. Computer science engineering"
                  disabled={isLoading}
                />
              </div>

              {/* Year of Completion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year of completion
                </label>
                <input
                  type="number"
                  name="education.gradYear"
                  value={formData.education.gradYear}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="YYYY"
                  min="1900"
                  max="2024"
                  disabled={isLoading}
                />
              </div>

              {/* Grade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <input
                  type="text"
                  name="education.grade"
                  value={formData.education.grade || ''}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter here"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <textarea
                  name="education.skills"
                  value={formData.education.skillsPrimary.join(', ')}
                  onChange={(e) => handleSkillsChange('skillsPrimary', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  className="input-field"
                  rows="4"
                  placeholder="Enter here"
                  disabled={isLoading}
                />
              </div>

              {/* Projects */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projects
                </label>
                <textarea
                  name="education.projects"
                  value={formData.education.skillsSecondary.join(', ')}
                  onChange={(e) => handleSkillsChange('skillsSecondary', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  className="input-field"
                  rows="4"
                  placeholder="Enter here"
                  disabled={isLoading}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Experience Tab */}
        {activeTab === 'experience' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Work Experience */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                <button
                  type="button"
                  onClick={addExperience}
                  className="btn-secondary flex items-center space-x-2"
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                      {formData.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Domain
                        </label>
                        <input
                          type="text"
                          value={exp.domain}
                          onChange={(e) => handleArrayChange('experience', index, { domain: e.target.value })}
                          className="input-field"
                          placeholder="e.g. Technology"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sub-domain
                        </label>
                        <input
                          type="text"
                          value={exp.subDomain}
                          onChange={(e) => handleArrayChange('experience', index, { subDomain: e.target.value })}
                          className="input-field"
                          placeholder="e.g. MERN Stack"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Experience
                        </label>
                        <select
                          value={exp.years}
                          onChange={(e) => handleArrayChange('experience', index, { years: e.target.value })}
                          className="input-field"
                          disabled={isLoading}
                        >
                          <option value="">Select an option</option>
                          <option value="0-1">0-1 years</option>
                          <option value="1-3">1-3 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5-10">5-10 years</option>
                          <option value="10+">10+ years</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="input-field"
                placeholder="linkedin.com/in/mrbean"
                disabled={isLoading}
              />
            </div>

            {/* Resume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData(prev => ({ ...prev, resume: file.name }));
                    }
                  }}
                  className="input-field"
                  disabled={isLoading}
                />
                {formData.resume && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{formData.resume}</span>
                    <button
                      type="button"
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      View
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Form Actions */}
        <div className="flex space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{user ? 'Updating...' : 'Adding...'}</span>
              </div>
            ) : (
              user ? 'Update User' : 'Add User'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
