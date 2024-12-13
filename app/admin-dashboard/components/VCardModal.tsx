import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { updateVCard } from '../../api/admin';
import LoadingSpinner from '../../components/LoadingSpinner';
import { theme } from '../theme-constants'; // Ensure you import the theme

interface VCardModalProps {
  vCard: {
    _id: string;
    fields: Array<{ name: string; value: string }>;
    templateId: number;
  };
  onClose: () => void;
  onSave: () => void;
}

export default function VCardModal({ vCard, onClose, onSave }: VCardModalProps) {
  const [fields, setFields] = useState(vCard.fields);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTemplateStyle = (templateId: number) => {
    const styles = {
      1: 'from-sky-400 to-blue-500',
      2: 'from-emerald-400 to-teal-500',
      3: 'from-violet-400 to-purple-500',
      4: 'from-amber-400 to-orange-500',
      5: 'from-rose-400 to-pink-500',
      6: 'from-indigo-400 to-purple-500'
    };
    return styles[templateId as keyof typeof styles] || styles[1];
  };

  const handleFieldChange = (index: number, value: string) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], value };
    setFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await updateVCard(vCard._id, { fields });
      onSave();
    } catch (error) {
      setError('Failed to update vCard. Please try again.');
      setIsLoading(false);
    }
  };

  const getFieldIcon = (fieldName: string) => {
    const icons: { [key: string]: string } = {
      name: '👤',
      email: '📧',
      phone: '📱',
      company: '🏢',
      title: '💼',
      website: '🌐',
      address: '📍',
      linkedin: '💼',
      twitter: '🐦',
      facebook: '👥',
      instagram: '📸',
      bio: '📝'
    };
    return icons[fieldName.toLowerCase()] || '📄';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`bg-gray-800 p-6 text-white`}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Edit vCard</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
          <p className="mt-2 opacity-90">Template {vCard.templateId}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={index} className="group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getFieldIcon(field.name)}</span>
                  <label className="text-sm font-medium text-gray-700 capitalize">{field.name}</label>
                </div>
                <input
                  type={field.name === 'email' ? 'email' : 'text'}
                  value={field.value}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  placeholder={`Enter your ${field.name}`}
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-lg bg-gray-800 text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {isLoading ? <LoadingSpinner /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
