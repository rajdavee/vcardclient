import React, { useState } from 'react';
import axios from 'axios';

interface VCard {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  templateId: number;
  fields: Array<{ name: string; value: string }>;
  qrCode: string;
}

interface VCardModalProps {
  vCard: VCard;
  onClose: () => void;
  onSave: (updatedVCard: VCard) => Promise<void>;
}

export default function VCardModal({ vCard, onClose, onSave }: VCardModalProps) {
  const [vCardData, setVCardData] = useState<VCard>({ ...vCard });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(vCardData);
    } catch (error) {
      console.error('Failed to update vCard:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Edit VCard</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Template ID"
            value={vCardData.templateId}
            onChange={(e) => setVCardData({ ...vCardData, templateId: parseInt(e.target.value) })}
            className="mb-2 w-full px-3 py-2 border rounded-md"
            required
          />
          {vCardData.fields.map((field, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Field Name"
                value={field.name}
                onChange={(e) => {
                  const newFields = [...vCardData.fields];
                  newFields[index].name = e.target.value;
                  setVCardData({ ...vCardData, fields: newFields });
                }}
                className="w-full px-3 py-2 border rounded-md mb-1"
              />
              <input
                type="text"
                placeholder="Field Value"
                value={field.value}
                onChange={(e) => {
                  const newFields = [...vCardData.fields];
                  newFields[index].value = e.target.value;
                  setVCardData({ ...vCardData, fields: newFields });
                }}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          ))}
          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
