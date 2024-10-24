'use client'
import React, { useState } from 'react';
import { updatePlanTemplates } from '../../api/admin';
import Templates, { TemplateId, templateFields } from '../../basic/components/Templates';

const PlanTemplateManagement: React.FC = () => {
  const [planName, setPlanName] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<TemplateId[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await updatePlanTemplates(planName, selectedTemplates);
      setMessage(`Successfully updated templates for ${planName}. ${response.updatedCount} users affected.`);
    } catch (err) {
      setError('Failed to update plan templates. Please try again.');
    }
  };

  const toggleTemplate = (templateId: TemplateId) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const dummyFields = {
    name: 'John Doe',
    jobTitle: 'Software Developer',
    phone: '+1 234 567 890',
    email: 'john@example.com',
    website: 'www.johndoe.com',
    address: '123 Main St, City',
    bio: 'Passionate about creating amazing software solutions.',
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8 mt-[5%]">
      <h2 className="text-2xl font-semibold mb-4">Manage Plan Templates</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="planName" className="block text-sm font-medium text-gray-700">
            Plan Name
          </label>
          <select
            id="planName"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select a plan</option>
            <option value="Basic">Basic</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Templates
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(templateFields).map((templateId) => (
              <div 
                key={templateId} 
                className={`cursor-pointer border-2 rounded-lg p-2 ${
                  selectedTemplates.includes(Number(templateId) as TemplateId)
                    ? 'border-indigo-500'
                    : 'border-gray-200'
                }`}
                onClick={() => toggleTemplate(Number(templateId) as TemplateId)}
              >
                <Templates
                  selectedTemplate={Number(templateId) as TemplateId}
                  fields={dummyFields}
                  croppedImage={null}
                />
                <div className="mt-2 flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedTemplates.includes(Number(templateId) as TemplateId)}
                    onChange={() => {}}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Template {templateId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Plan Templates
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default PlanTemplateManagement;