import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Eye, ChevronLeft, ChevronRight, Search, Filter, Download, AlertCircle } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const getTemplateStyle = (templateId: number) => {
    const styles = {
      1: {
        gradient: 'from-sky-400 to-blue-500',
        lightBg: 'bg-sky-50',
        textColor: 'text-sky-600',
        borderColor: 'border-sky-100',
        iconColor: 'text-sky-500',
        hoverBg: 'hover:bg-sky-50'
      },
      2: {
        gradient: 'from-emerald-400 to-teal-500',
        lightBg: 'bg-emerald-50',
        textColor: 'text-emerald-600',
        borderColor: 'border-emerald-100',
        iconColor: 'text-emerald-500',
        hoverBg: 'hover:bg-emerald-50'
      },
      3: {
        gradient: 'from-violet-400 to-purple-500',
        lightBg: 'bg-violet-50',
        textColor: 'text-violet-600',
        borderColor: 'border-violet-100',
        iconColor: 'text-violet-500',
        hoverBg: 'hover:bg-violet-50'
      },
      4: {
        gradient: 'from-amber-400 to-orange-500',
        lightBg: 'bg-amber-50',
        textColor: 'text-amber-600',
        borderColor: 'border-amber-100',
        iconColor: 'text-amber-500',
        hoverBg: 'hover:bg-amber-50'
      },
      5: {
        gradient: 'from-rose-400 to-pink-500',
        lightBg: 'bg-rose-50',
        textColor: 'text-rose-600',
        borderColor: 'border-rose-100',
        iconColor: 'text-rose-500',
        hoverBg: 'hover:bg-rose-50'
      },
      6: {
        gradient: 'from-indigo-400 to-purple-500',
        lightBg: 'bg-indigo-50',
        textColor: 'text-indigo-600',
        borderColor: 'border-indigo-100',
        iconColor: 'text-indigo-500',
        hoverBg: 'hover:bg-indigo-50'
      }
    };
    return styles[templateId as keyof typeof styles] || styles[1];
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">VCard Management</h3>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor all vCards
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
            <Download size={18} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search vCards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 rounded-lg py-2 px-4 pl-10 focus:ring-2 focus:ring-primary-light focus:bg-white transition-colors"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(Number(e.target.value) || 'all')}
          className="w-full bg-gray-50 rounded-lg py-2 px-4 focus:ring-2 focus:ring-primary-light focus:bg-white transition-colors"
        >
          <option value="all">All Templates</option>
          {Array.from({ length: 6 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>Template {num}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-600">
            <AlertCircle className="mr-2" />
            {error}
          </div>
        ) : currentCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Filter size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No vCards found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCards.map((vCard) => {
              const style = getTemplateStyle(vCard.templateId);
              return (
                <div 
                  key={vCard._id} 
                  className={`group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border ${style.borderColor}`}
                >
                  {/* Gradient Header */}
                  <div className={`bg-gradient-to-r ${style.gradient} p-4 text-white`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold">
                          {vCard.fields.find(field => field.name === 'name')?.value || 'Unnamed vCard'}
                        </h4>
                        <p className="text-sm opacity-90">{getUserEmail(vCard)}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${style.lightBg} ${style.textColor}`}>
                        Template {vCard.templateId}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Card Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className={`${style.lightBg} rounded-lg p-3`}>
                        <p className="text-xs text-gray-600">Last Updated</p>
                        <p className={`text-sm font-medium ${style.textColor}`}>
                          {formatDate(vCard.lastUpdated)}
                        </p>
                      </div>
                      <div className={`${style.lightBg} rounded-lg p-3`}>
                        <p className="text-xs text-gray-600">Total Scans</p>
                        <p className={`text-sm font-medium ${style.textColor}`}>
                          {vCard.scanCount || 0}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => {
                          setSelectedVCard(vCard);
                          setIsPreviewOpen(true);
                        }}
                        className={`p-2 rounded-lg ${style.hoverBg} ${style.iconColor} transition-colors`}
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVCard(vCard);
                          setIsModalOpen(true);
                        }}
                        className={`p-2 rounded-lg ${style.hoverBg} ${style.iconColor} transition-colors`}
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteVCard(vCard._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {currentCards.map((vCard) => {
                const style = getTemplateStyle(vCard.templateId);
                return (
                  <div 
                    key={vCard._id}
                    className={`group transition-colors ${style.hoverBg}`}
                  >
                    <div className="flex items-center p-4">
                      <div className={`w-1.5 h-16 rounded-r-full bg-gradient-to-b ${style.gradient} mr-4`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-medium text-gray-900">
                          {vCard.fields.find(field => field.name === 'name')?.value || 'Unnamed vCard'}
                        </h4>
                        <p className="text-sm text-gray-500">{getUserEmail(vCard)}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className={`text-sm ${style.textColor}`}>
                            <span className="font-medium">{vCard.scanCount || 0}</span> scans
                          </span>
                          <span className="text-sm text-gray-500">
                            Updated {formatDate(vCard.lastUpdated)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedVCard(vCard);
                            setIsPreviewOpen(true);
                          }}
                          className={`p-2 rounded-lg ${style.hoverBg} ${style.iconColor} transition-colors`}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedVCard(vCard);
                            setIsModalOpen(true);
                          }}
                          className={`p-2 rounded-lg ${style.hoverBg} ${style.iconColor} transition-colors`}
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteVCard(vCard._id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredCards.length > 0 && (
          <div className="mt-6 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
            <span className="text-sm text-gray-600">
              Showing {indexOfFirstCard + 1} to {Math.min(indexOfLastCard, filteredCards.length)} of {filteredCards.length} vCards
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isModalOpen && selectedVCard && (
        <VCardModal
          vCard={selectedVCard as any}
          onClose={() => setIsModalOpen(false)} 
          onSave={() => {
            setIsModalOpen(false);
            fetchVCards();
          }}
        />
      )}
      {isPreviewOpen && selectedVCard && (
        <div 
          className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full flex items-center justify-center z-50"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div 
            className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full mx-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">VCard Preview</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <VCardPreview
              previewData={{
                templateId: selectedVCard.templateId as TemplateId,
                fields: selectedVCard.fields,
                qrCodeDataUrl: selectedVCard.qrCode
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
