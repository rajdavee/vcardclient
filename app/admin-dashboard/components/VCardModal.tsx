import React, { useState } from 'react';
import { updateVCard } from '../../api/admin';

interface User {
  _id: string;
  username: string;
  email: string;
}

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
  onSave: () => void;
}

export default function VCardModal({ vCard, onClose, onSave }: VCardModalProps) {
  const [vCardData, setVCardData] = useState<VCard>({ ...vCard });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateVCard(vCard._id, vCardData);
      onSave();
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
          <button
            type="button"
            onClick={() => setVCardData({ ...vCardData, fields: [...vCardData.fields, { name: '', value: '' }] })}
            className="mb-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Add Field
          </button>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
