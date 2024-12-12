import React, { useState } from 'react';
import { X, User, Mail, Shield, CreditCard, DollarSign } from 'lucide-react';
import { theme } from '../theme-constants';

interface EditUserModalProps {
  user: UserData;
  onClose: () => void;
  onEditUser: (userId: string, userData: UserData) => void;
  onUpdatePlan: (userId: string, planName: string, price: number) => void;
}

interface UserData {
  _id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  firstName?: string;
  lastName?: string;
  plan?: {
    name: string;
    price: number;
  };
}

interface ValidationErrors {
  username?: string;
  email?: string;
  planName?: string;
  planPrice?: string;
}

export default function EditUserModal({ user, onClose, onEditUser, onUpdatePlan }: EditUserModalProps) {
  const [userData, setUserData] = useState({ ...user });
  const [newPlan, setNewPlan] = useState({
    name: user.plan?.name || '',
    price: user.plan?.price || 0,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlanUpdating, setIsPlanUpdating] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!userData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!userData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePlan = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!newPlan.name.trim()) {
      newErrors.planName = 'Plan name is required';
    }

    if (newPlan.price < 0) {
      newErrors.planPrice = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onEditUser(user._id, userData);
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlanUpdate = async () => {
    if (!validatePlan()) return;

    setIsPlanUpdating(true);
    try {
      await onUpdatePlan(user._id, newPlan.name, newPlan.price);
      // Show success message or handle success case
    } catch (error) {
      console.error('Error updating plan:', error);
    } finally {
      setIsPlanUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-8 w-full max-w-md shadow-xl rounded-xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Edit User Profile</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Information Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-700">User Information</h4>
            
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-main transition-colors ${
                    errors.username ? 'border-error-main' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-error-main">{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-main transition-colors ${
                    errors.email ? 'border-error-main' : 'border-gray-300'
                  }`}
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-main">{errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div className="relative">
                <Shield size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={userData.role}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value as 'user' | 'admin' })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-main transition-colors appearance-none bg-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Plan Section */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-md font-semibold text-gray-700">Subscription Plan</h4>
            
            {/* Plan Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              <div className="relative">
                <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-main transition-colors ${
                    errors.planName ? 'border-error-main' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.planName && (
                <p className="mt-1 text-sm text-error-main">{errors.planName}</p>
              )}
            </div>

            {/* Plan Price Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Price</label>
              <div className="relative">
                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-main transition-colors ${
                    errors.planPrice ? 'border-error-main' : 'border-gray-300'
                  }`}
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.planPrice && (
                <p className="mt-1 text-sm text-error-main">{errors.planPrice}</p>
              )}
            </div>

            {/* Update Plan Button */}
            <button
              type="button"
              onClick={handlePlanUpdate}
              disabled={isPlanUpdating}
              className={`w-full px-4 py-2 text-sm font-medium text-white bg-success-main rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                isPlanUpdating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isPlanUpdating ? 'Updating Plan...' : 'Update Plan'}
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
