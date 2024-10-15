import React, { useState } from 'react'

interface AddUserModalProps {
  onClose: () => void
  onAddUser: (userData: any) => void
}

export default function AddUserModal({ onClose, onAddUser }: AddUserModalProps) {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddUser(userData)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New User</h3>
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
          <input
            type="password"
            placeholder="Password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
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
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}