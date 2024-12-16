import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Eye, ChevronLeft, ChevronRight, Search, Filter, AlertCircle, MoreHorizontal } from 'lucide-react';
import { getAllVCards, deleteVCard } from '../../api/admin';
import VCardModal from './VCardModal';
import VCardPreview from '../../components/VCardPreview';
import { TemplateId } from '@/app/basic/components/Templates';
import LoadingSpinner from '../../components/LoadingSpinner';
import './VCardManagement.css'; // Import custom CSS for styling

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null); // State to manage dropdown visibility

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
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">VCard Management</h2>

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
        ) : (
          <div className="flex overflow-hidden space-x-4">
            {currentCards.map((vCard) => (
              <div key={vCard._id} className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg shadow-lg p-4 w-1/3 transition-transform transform relative group hover:shadow-xl hover:scale-105 mx-2 border border-gray-300">
                <h3 className="font-bold text-xl mb-2" style={{ color: ' #DA70D6' }}>{vCard.fields.find(field => field.name === 'name')?.value || 'Unnamed vCard'}</h3>
                
                {/* Preview of vCard */}
                <div className="relative my-2">
                  <div className="h-32 w-full bg-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:h-48">
                    <VCardPreview
                      previewData={{
                        templateId: vCard.templateId as TemplateId,
                        fields: vCard.fields,
                        qrCodeDataUrl: vCard.qrCode
                      }}
                    />
                  </div>
                </div>

                {/* Information Section with Partitions */}
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <p className="text-gray-700">Email: <span className="font-semibold">{getUserEmail(vCard)}</span></p>
                  <p className="text-gray-700">Last Updated: <span className="font-semibold">{formatDate(vCard.lastUpdated)}</span></p>
                  <p className="text-gray-700">Total Scans: <span className="font-semibold">{vCard.scanCount || 0}</span></p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedVCard(vCard); setIsPreviewOpen(true); }} 
                    className="action-button bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-full shadow-md px-4 py-2 flex items-center"
                  >
                    <Eye className="mr-2" /> Preview
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedVCard(vCard); setIsModalOpen(true); }} 
                    className="action-button bg-green-600 text-white hover:bg-green-700 transition-colors rounded-full shadow-md px-4 py-2 flex items-center"
                  >
                    <Edit3 className="mr-2" /> Edit
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteVCard(vCard._id); }} 
                    className="action-button bg-red-600 text-white hover:bg-red-700 transition-colors rounded-full shadow-md px-4 py-2 flex items-center"
                  >
                    <Trash2 className="mr-2" /> Delete
                  </button>
                </div>

                {/* Preview on hover */}
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <VCardPreview
                    previewData={{
                      templateId: vCard.templateId as TemplateId,
                      fields: vCard.fields,
                      qrCodeDataUrl: vCard.qrCode
                    }}
                  />
                </div>
              </div>
            ))}
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
          onMouseLeave={() => setSelectedVCard(null)}
        >
          <div 
            className="bg-white p-8 rounded-xl shadow-xl max-w-2xl w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">VCard Preview</h3>
              <button
                onClick={() => setSelectedVCard(null)}
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
