import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllVCards, deleteVCard } from '../../api/admin';
import VCardModal from './VCardModal';
import VCardPreview from '../../components/VCardPreview';
import { TemplateId } from '@/app/basic/components/Templates';

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
}

export default function VCardManagement({ loadAdminData }: VCardManagementProps) {
  const [vCards, setVCards] = useState<VCard[]>([]);
  const [selectedVCard, setSelectedVCard] = useState<VCard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;

  useEffect(() => {
    fetchVCards();
  }, []);

  const fetchVCards = async () => {
    try {
      const data = await getAllVCards();
      setVCards(data);
    } catch (error) {
      console.error('Failed to fetch vCards:', error);
      setVCards([]);
    }
  };

  const handleDeleteVCard = async (vCardId: string) => {
    if (window.confirm('Are you sure you want to delete this vCard?')) {
      try {
        console.log(`Attempting to delete vCard with ID: ${vCardId}`);
        await deleteVCard(vCardId);
        console.log('VCard deleted successfully');
        await fetchVCards();
        loadAdminData();
      } catch (error) {
        console.error('Failed to delete vCard:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  const getUserEmail = (vCard: VCard) => {
    if (typeof vCard.userId === 'object' && vCard.userId !== null) {
      return vCard.userId.email;
    }
    return 'Email not available';
  };

  // Calculate pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = vCards.slice(indexOfFirstCard, indexOfLastCard);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-xl font-semibold text-gray-800">VCard Management</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentCards.map((vCard) => (
            <div key={vCard._id} className="border rounded-lg overflow-hidden shadow-md">
              <div className="p-4">
                <h4 className="text-lg font-semibold mb-2">
                  {vCard.fields.find(field => field.name === 'name')?.value || 'Unnamed vCard'}
                </h4>
                <p className="text-sm text-gray-600 mb-4">{getUserEmail(vCard)}</p>
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
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastCard >= vCards.length}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full">
            <h3 className="text-2xl font-bold mb-4">VCard Preview</h3>
            <VCardPreview
              templateId={selectedVCard.templateId as TemplateId}
              fields={selectedVCard.fields} 
              qrCodeDataUrl={selectedVCard.qrCode}
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
}
