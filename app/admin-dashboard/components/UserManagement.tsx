import React, { useState, useEffect, useMemo } from 'react';
import { 
  Edit3, 
  Trash2, 
  ChevronDown, 
  Search, 
  UserPlus, 
  Shield, 
  Filter,
  Download,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { 
  searchUsers, 
  promoteToAdmin, 
  updateUserPlan, 
  deleteUser, 
  addUser, 
  editUser 
} from '../../api/admin';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { theme } from '../theme-constants';

interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  plan?: {
    name: string;
    price: number;
  };
  vCards?: any[];
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface UserManagementProps {
  users: User[];
  loadAdminData: () => void;
}

export default function UserManagement({ users, loadAdminData }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [filterConfig, setFilterConfig] = useState({
    role: 'all',
    plan: 'all',
    status: 'all'
  });

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  // Memoized filtered and sorted users
  const processedUsers = useMemo(() => {
    let result = [...filteredUsers];

    // Apply filters
    if (filterConfig.role !== 'all') {
      result = result.filter(user => user.role === filterConfig.role);
    }
    if (filterConfig.plan !== 'all') {
      result = result.filter(user => user.plan?.name === filterConfig.plan);
    }
    if (filterConfig.status !== 'all') {
      result = result.filter(user => 
        filterConfig.status === 'active' ? user.isVerified : !user.isVerified
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key as keyof User];
      const bValue = b[sortConfig.key as keyof User];
      
      // Handle nested plan property
      if (sortConfig.key === 'plan') {
        const aPlan = a.plan?.name || '';
        const bPlan = b.plan?.name || '';
        return sortConfig.direction === 'asc' 
          ? aPlan.localeCompare(bPlan)
          : bPlan.localeCompare(aPlan);
      }
      
      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Handle number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      return 0;
    });

    return result;
  }, [filteredUsers, sortConfig, filterConfig]);

  // Pagination
  const totalPages = Math.ceil(processedUsers.length / itemsPerPage);
  const currentUsers = processedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchUsers = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setIsSearching(true);
      try {
        const results = await searchUsers(query);
        setFilteredUsers(results);
      } catch (err) {
        console.error('Failed to search users:', err);
      } finally {
        setIsSearching(false);
      }
    } else {
      setFilteredUsers(users);
    }
  };

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

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleBulkAction = async (action: 'delete' | 'promote' | 'export') => {
    if (!selectedUsers.length) return;

    switch (action) {
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
          try {
            await Promise.all(selectedUsers.map(id => deleteUser(id)));
            loadAdminData();
            setSelectedUsers([]);
          } catch (err) {
            console.error('Failed to delete users:', err);
          }
        }
        break;
        
      case 'promote':
        try {
          await Promise.all(selectedUsers.map(id => promoteToAdmin(id)));
          loadAdminData();
          setSelectedUsers([]);
        } catch (err) {
          console.error('Failed to promote users:', err);
        }
        break;
        
      case 'export':
        try {
          const usersToExport = processedUsers.filter(user => 
            selectedUsers.includes(user._id || user.id || '')
          );
          // Implement your export logic here
          console.log('Exporting users:', usersToExport);
        } catch (err) {
          console.error('Failed to export users:', err);
        }
        break;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h3 className="text-xl font-bold text-gray-900">User Management</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor user accounts
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleBulkAction('export')}
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download size={18} className="mr-2" />
            Export
          </button>
          <button 
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center px-4 py-2 text-white bg-primary-main rounded-lg hover:bg-primary-dark transition-colors"
          >
            <UserPlus size={18} className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="p-6 border-b grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearchUsers(e.target.value)}
            className="w-full bg-gray-50 text-gray-700 rounded-lg py-2 px-4 pl-10 focus:ring-2 focus:ring-primary-light focus:bg-white transition-colors"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <LoadingSpinner />
            </div>
          )}
        </div>

        {/* Role Filter */}
        <select
          value={filterConfig.role}
          onChange={(e) => setFilterConfig(prev => ({ ...prev, role: e.target.value }))}
          className="w-full bg-gray-50 text-gray-700 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-light focus:bg-white transition-colors"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>

        {/* Plan Filter */}
        <select
          value={filterConfig.plan}
          onChange={(e) => setFilterConfig(prev => ({ ...prev, plan: e.target.value }))}
          className="w-full bg-gray-50 text-gray-700 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-light focus:bg-white transition-colors"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
        </select>

        {/* Status Filter */}
        <select
          value={filterConfig.status}
          onChange={(e) => setFilterConfig(prev => ({ ...prev, status: e.target.value }))}
          className="w-full bg-gray-50 text-gray-700 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-light focus:bg-white transition-colors"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelectedUsers(checked ? currentUsers.map(u => u._id || u.id || '') : []);
                  }}
                  className="rounded text-primary-main focus:ring-primary-light"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">vCards</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentUsers.map((user, index) => (
              <tr key={user._id || user.id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id || user.id || '')}
                    onChange={(e) => {
                      const id = user._id || user.id || '';
                      setSelectedUsers(prev => 
                        e.target.checked 
                          ? [...prev, id]
                          : prev.filter(userId => userId !== id)
                      );
                    }}
                    className="rounded text-primary-main focus:ring-primary-light"
                  />
                </td>
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
                  <button onClick={() => user.id && handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 transition duration-200">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedUsers.length)} of {processedUsers.length} users
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      {isAddUserModalOpen && (
        <AddUserModal onClose={() => setIsAddUserModalOpen(false)} onAddUser={handleAddUser} />
      )}
      {isEditUserModalOpen && selectedUser && (
        <EditUserModal 
          user={{...selectedUser, _id: selectedUser._id || ''}} 
          onClose={() => setIsEditUserModalOpen(false)} 
          onEditUser={handleEditUser}
          onUpdatePlan={handleUpdateUserPlan}
        />
      )}
    </div>
  );
}
