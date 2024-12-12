'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import VCardModal from './components/VCardModal';
import VCardPreview from '../components/VCardPreview';
import { TemplateId } from '../basic/components/Templates';
import { Edit3, Trash2, Eye } from 'lucide-react';

interface VCard {
  userId: { _id: string; username: string; email: string; };
  _id: string;
  templateId: number;
  fields: Array<{ name: string; value: string }>;
  qrCode: string;
}

const UserVCardsPage: React.FC = () => {
  const router = useRouter();
  const [vCards, setVCards] = useState<VCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVCard, setSelectedVCard] = useState<VCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    fetchVCards();
  }, []);

  const fetchVCards = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get('/api/user-vcards', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setVCards(response.data.vCards);
    } catch (err) {
      console.error('Error fetching vCards:', err);
      setError('Failed to fetch vCards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVCard = async (vCardId: string) => {
    if (window.confirm('Are you sure you want to delete this vCard?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/user-vcards/${vCardId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setVCards(vCards.filter(card => card._id !== vCardId));
      } catch (err) {
        console.error('Error deleting vCard:', err);
        setError('Failed to delete vCard. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Digital Business Cards
              </h1>
              <p className="text-blue-100 text-lg">
                Manage and share your professional identity
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => window.location.href='/basic'}
                className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Create New Card +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading your cards...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 text-red-700">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Error:</span> {error}
            </div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-medium mb-2">Total Cards</h3>
                <p className="text-3xl font-bold">{vCards.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-medium mb-2">Total Views</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                <h3 className="text-lg font-medium mb-2">Active Cards</h3>
                <p className="text-3xl font-bold">{vCards.length}</p>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vCards.map((vCard) => (
                <div 
                  key={vCard._id} 
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {vCard.fields.find(f => f.name === 'name')?.value || `VCard ${vCard._id.slice(-4)}`}
                      </h2>
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full">
                        Template {vCard.templateId}
                      </span>
                    </div>
                    
                    {/* VCard Details */}
                    <div className="space-y-3">
                      {vCard.fields.slice(0, 3).map((field) => (
                        <p key={field.name} className="text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                          <span className="font-medium capitalize min-w-[80px]">{field.name}:</span>
                          <span className="ml-2 truncate">{field.value}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Share Section */}
                  <div className="p-4 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share Link
                    </p>
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                      <input
                        type="text"
                        value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/preview?vCardId=${vCard._id}`}
                        readOnly
                        className="flex-1 px-4 py-2.5 text-sm bg-transparent outline-none rounded-l-lg"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${process.env.NEXT_PUBLIC_FRONTEND_URL}/preview?vCardId=${vCard._id}`
                          );
                          alert('Link copied to clipboard!');
                        }}
                        className="px-4 py-2.5 text-blue-600 hover:text-blue-700 font-medium text-sm border-l bg-gray-50 hover:bg-gray-100 transition-colors rounded-r-lg"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 flex items-center justify-between border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedVCard(vCard);
                          setIsPreviewOpen(true);
                        }}
                        className="flex items-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Eye size={18} className="mr-1" />
                        Preview
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedVCard(vCard);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      >
                        <Edit3 size={18} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVCard(vCard._id)}
                        className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={18} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Preview Modal with enhanced styling */}
        {isPreviewOpen && selectedVCard && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full m-4 max-h-[90vh] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Card Preview</h3>
                  <button
                    onClick={() => setIsPreviewOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
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
          </div>
        )}

        {/* Edit Modal remains the same */}
        {isModalOpen && selectedVCard && (
          <VCardModal
            vCard={{...selectedVCard, userId: selectedVCard.userId}}
            onClose={() => setIsModalOpen(false)}
            onSave={async (updatedVCard) => {
              try {
                const token = localStorage.getItem('token');
                await axios.put('/api/user-vcards', {
                  vCardId: updatedVCard._id,
                  templateId: updatedVCard.templateId,
                  fields: updatedVCard.fields
                }, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });
                setIsModalOpen(false);
                fetchVCards();
              } catch (err) {
                console.error('Error updating vCard:', err);
                setError('Failed to update vCard. Please try again.');
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserVCardsPage;
