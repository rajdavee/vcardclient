'use client';

import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Eye, ChevronLeft, ChevronRight, Search, Filter, AlertCircle, UserCircle, MoreHorizontal, Phone, Globe, MapPin, Mail } from 'lucide-react';
import { getAllVCards, deleteVCard } from '../../api/admin';
import VCardModal from './VCardModal';
import VCardPreview from '../../components/VCardPreview';
import { TemplateId } from '@/app/basic/components/Templates';
import LoadingSpinner from '../../components/LoadingSpinner';

interface VCardManagementProps {
  loadAdminData: () => void;
}

interface User {
  _id: string;
  username: string;
  email: string;
}

interface VCard {
  _id: string;
  userId: User | string;
  templateId: number;
  fields: Array<{ name: string; value: string }>;
  qrCode: string;
  createdAt?: string;
  lastUpdated?: string;
  scanCount?: number;
}

export default function VCardManagement({ loadAdminData }: VCardManagementProps) {
  const [vCards, setVCards] = useState<VCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<VCard[]>([]);
  const [selectedVCard, setSelectedVCard] = useState<VCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<number | 'all'>('all');
  const cardsPerPage = 6;
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchVCards();
  }, []);

  useEffect(() => {
    filterVCards();
  }, [searchQuery, selectedTemplate, vCards]);

  const fetchVCards = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllVCards();
      setVCards(data);
      setFilteredCards(data);
    } catch (error) {
      console.error('Failed to fetch vCards:', error);
      setError('Failed to load vCards. Please try again later.');
      setVCards([]);
      setFilteredCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVCards = () => {
    let filtered = [...vCards];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(card => 
        card.fields.some(field => 
          field.value.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (typeof card.userId === 'object' && 
         card.userId.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply template filter
    if (selectedTemplate !== 'all') {
      filtered = filtered.filter(card => card.templateId === selectedTemplate);
    }

    setFilteredCards(filtered);
    setCurrentPage(1);
  };

  const handleDeleteVCard = async (vCardId: string) => {
    if (!window.confirm('Are you sure you want to delete this vCard?')) return;

    try {
      await deleteVCard(vCardId);
      await fetchVCards();
      loadAdminData();
    } catch (error) {
      console.error('Failed to delete vCard:', error);
      setError('Failed to delete vCard. Please try again.');
    }
  };

  const getUserEmail = (vCard: VCard) => {
    if (typeof vCard.userId === 'object' && vCard.userId !== null) {
      return vCard.userId.email;
    }
    return 'Email not available';
  };

  // Pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            vCard Management
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Manage and track your digital business cards effortlessly
          </p>
        </header>

        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search vCards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(Number(e.target.value) || 'all')}
            className="w-full sm:w-[180px] px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Templates</option>
            {Array.from({ length: 6 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Template {i + 1}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-600">
            <AlertCircle className="mr-2" />
            {error}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentCards.map((vCard) => (
              <div key={vCard._id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:scale-105 relative p-4">
                
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <UserCircle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100">
                        {vCard.fields.find(f => f.name === 'name')?.value || 'Unnamed'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {vCard.fields.find(f => f.name === 'jobTitle')?.value || 'No title'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Three-Dot Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setDropdownOpen(dropdownOpen === vCard._id ? null : vCard._id)}
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="More options"
                    >
                      <MoreHorizontal className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    {/* Dropdown Menu */}
                    {dropdownOpen === vCard._id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                        <button
                          onClick={() => { setSelectedVCard(vCard); setIsPreviewOpen(true); setDropdownOpen(null); }}
                          className="flex items-center block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                        >
                          <Eye className="mr-2 h-4 w-4 text-blue-500" />
                          Preview
                        </button>
                        <button
                          onClick={() => { setSelectedVCard(vCard); setIsModalOpen(true); setDropdownOpen(null); }}
                          className="flex items-center block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors"
                        >
                          <Edit3 className="mr-2 h-4 w-4 text-green-500" />
                          Edit
                        </button>
                        <button
                          onClick={() => { handleDeleteVCard(vCard._id); setDropdownOpen(null); }}
                          className="flex items-center block px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-600 w-full text-left transition-colors"
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="mt-4 space-y-2">
                  <p className="text-sm flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-medium">Email:</span> {getUserEmail(vCard)}
                  </p>
                  <p className="text-sm flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-medium">Phone:</span> {vCard.fields.find(f => f.name === 'phone')?.value || 'N/A'}
                  </p>
                  <p className="text-sm flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-medium">Website:</span> {vCard.fields.find(f => f.name === 'website')?.value || 'N/A'}
                  </p>
                  <p className="text-sm flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="font-medium">Address:</span> {vCard.fields.find(f => f.name === 'address')?.value || 'N/A'}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Last Updated:</span> {formatDate(vCard.lastUpdated)}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total Scans:</span> {vCard.scanCount || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && selectedVCard && (
        <VCardModal
          vCard={selectedVCard}
          onClose={() => setIsModalOpen(false)}
          onSave={() => console.log('VCard saved successfully!')}
        />
      )}

      {isPreviewOpen && selectedVCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-auto p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold mb-2">
              {selectedVCard.fields.find(f => f.name === 'name')?.value || 'Unnamed'}
            </h2>
            <p className="text-md font-medium mb-2">
              {selectedVCard.fields.find(f => f.name === 'jobTitle')?.value || 'No title'}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Email:</span> {getUserEmail(selectedVCard)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Last Updated:</span> {formatDate(selectedVCard.lastUpdated)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Total Scans:</span> {selectedVCard.scanCount || 0}
              </p>
            </div>

            {/* Render the vCardPreview with the selected vCard's data */}
            <div className="mt-2">
              <VCardPreview
                previewData={{
                  templateId: selectedVCard.templateId as TemplateId,
                  fields: selectedVCard.fields,
                  qrCodeDataUrl: selectedVCard.qrCode
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
