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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your VCards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vCards.map((vCard) => (
          <div key={vCard._id} className="border rounded-lg overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">VCard {vCard._id}</h2>
              <p>Template: {vCard.templateId}</p>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-500">VCard Link:</p>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/preview?vCardId=${vCard._id}`}
                    readOnly
                    className="text-sm w-full bg-gray-100 border border-gray-300 rounded px-2 py-1"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/preview?vCardId=${vCard._id}`);
                      alert('Link copied to clipboard!');
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-3 flex justify-end">
              <button
                onClick={() => {
                  setSelectedVCard(vCard);
                  setIsPreviewOpen(true);
                }}
                className="text-blue-600 hover:text-blue-800 mr-3 transition duration-200"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => {
                  setSelectedVCard(vCard);
                  setIsModalOpen(true);
                }}
                className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-200"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => handleDeleteVCard(vCard._id)}
                className="text-red-600 hover:text-red-900 transition duration-200"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && selectedVCard && (
        <VCardModal
          vCard={{...selectedVCard, userId: selectedVCard.userId}}
          onClose={() => setIsModalOpen(false)}
          onSave={async (updatedVCard) => {
            try {
              const token = localStorage.getItem('token');
              const response = await axios.put('/api/user-vcards', {
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
      {isPreviewOpen && selectedVCard && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-4">VCard Preview</h3>
            <VCardPreview
              previewData={{
                templateId: selectedVCard.templateId as TemplateId,
                fields: selectedVCard.fields,   
                qrCodeDataUrl: selectedVCard.qrCode
              }}
            />
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserVCardsPage;
