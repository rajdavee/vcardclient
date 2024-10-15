import React, { useState } from 'react'

interface EditUserModalProps {
  user: any
  onClose: () => void
  onEditUser: (userId: string, userData: any) => void
  onUpdatePlan: (userId: string, planName: string, price: number) => void
}

export default function EditUserModal({ user, onClose, onEditUser, onUpdatePlan }: EditUserModalProps) {
  const [userData, setUserData] = useState({ ...user })
  const [newPlan, setNewPlan] = useState({ name: user.plan?.name || '', price: user.plan?.price || 0 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user._id) {
      console.error('User ID is missing');
      return;
    }
    onEditUser(user._id, userData);
  }

  const handlePlanUpdate = () => {
    if (!user._id) {
      console.error('User ID is missing');
      return;
    }
    onUpdatePlan(user._id, newPlan.name, newPlan.price);
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit User</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={userData.username}
            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
            className="mb-2 w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            className="mb-2 w-full px-3 py-2 border rounded-md"
            required
          />
          <select
            value={userData.role}
            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
            className="mb-4 w-full px-3 py-2 border rounded-md"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Update Plan</h4>
            <input
              type="text"
              placeholder="Plan Name"
              value={newPlan.name}
              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
              className="mb-2 w-full px-3 py-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Plan Price"
              value={newPlan.price}
              onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
              className="mb-2 w-full px-3 py-2 border rounded-md"
            />
            <button type="button" onClick={handlePlanUpdate} className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500">
              Update Plan
            </button>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
