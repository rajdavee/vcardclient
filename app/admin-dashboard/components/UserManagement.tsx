import React, { useState } from 'react'
import { Edit3, Trash2, ChevronDown, Search } from 'lucide-react'
import { searchUsers, promoteToAdmin, updateUserPlan, deleteUser, addUser, editUser } from '../../api/admin'
import AddUserModal from './AddUserModal'
import EditUserModal from './EditUserModal'

interface UserManagementProps {
  users: any[]
  loadAdminData: () => void
}

export default function UserManagement({ users, loadAdminData }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredUsers, setFilteredUsers] = useState(users)
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const handleSearchUsers = async (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      try {
        const results = await searchUsers(query)
        setFilteredUsers(results)
      } catch (err) {
        console.error('Failed to search users. Please try again.')
      }
    } else {
      setFilteredUsers(users)
    }
  }

  const handleAddUser = async (userData: any) => {
    try {
      await addUser(userData)
      setIsAddUserModalOpen(false)
      loadAdminData()
    } catch (err) {
      console.error('Failed to add user. Please try again.')
    }
  }

  const handleEditUser = async (userId: string, userData: any) => {
    try {
      if (!userId) {
        console.error('User ID is undefined');
        return;
      }
      await editUser(userId, userData);
      setIsEditUserModalOpen(false);
      loadAdminData();
    } catch (err) {
      console.error('Failed to edit user. Please try again.', err);
    }
  };

  const handlePromoteToAdmin = async (userId: string) => {
    try {
      await promoteToAdmin(userId)
      loadAdminData()
    } catch (err) {
      console.error('Failed to promote user to admin. Please try again.')
    }
  }

  const handleUpdateUserPlan = async (userId: string, planName: string, price: number) => {
    try {
      await updateUserPlan(userId, planName, price);
      setIsEditUserModalOpen(false);
      loadAdminData();
    } catch (err) {
      console.error('Failed to update user plan. Please try again.', err);
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId)
        loadAdminData()
      } catch (err) {
        console.error('Failed to delete user. Please try again.')
      }
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="text-xl font-semibold text-gray-800">User Management</h3>
        <button 
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
        >
          Add New User
        </button>
      </div>
      <div className="px-6 py-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearchUsers(e.target.value)}
            className="w-full bg-gray-100 text-gray-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">vCards</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user: any, index: number) => (
              <tr key={user._id || user.id || index} className="hover:bg-gray-50 transition duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full object-cover" src={`https://i.pravatar.cc/150?img=${index + 1}`} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.plan?.name || 'Free'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.vCards?.length || 0}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isVerified ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => {
                      setSelectedUser({...user, _id: user._id || user.id});
                      setIsEditUserModalOpen(true);
                    }} 
                    className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-200"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 transition duration-200">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <button className="text-blue-600 hover:text-blue-800 flex items-center transition duration-200">
          View All Users
          <ChevronDown size={16} className="ml-1" />
        </button>
        <div className="flex items-center">
          <span className="text-sm text-gray-700 mr-2">Page 1 of 10</span>
          <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200">
            Previous
          </button>
          <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition duration-200 ml-2">
            Next
          </button>
        </div>
      </div>
      {isAddUserModalOpen && (
        <AddUserModal onClose={() => setIsAddUserModalOpen(false)} onAddUser={handleAddUser} />
      )}
      {isEditUserModalOpen && selectedUser && (
        <EditUserModal 
          user={selectedUser} 
          onClose={() => setIsEditUserModalOpen(false)} 
          onEditUser={handleEditUser}
          onUpdatePlan={handleUpdateUserPlan}
        />
      )}
    </div>
  )
}
