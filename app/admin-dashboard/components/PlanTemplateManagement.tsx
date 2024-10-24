import React, { useState } from 'react';
import { updatePlanTemplates } from '../../api/admin';

const PlanTemplateManagement: React.FC = () => {
  const [planName, setPlanName] = useState('');
  const [templates, setTemplates] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const templateArray = templates.split(',').map(t => parseInt(t.trim(), 10));
      const response = await updatePlanTemplates(planName, templateArray);
      setMessage(`Successfully updated templates for ${planName}. ${response.updatedCount} users affected.`);
    } catch (err) {
      setError('Failed to update plan templates. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Manage Plan Templates</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="planName" className="block text-sm font-medium text-gray-700">
            Plan Name
          </label>
          <input
            type="text"
            id="planName"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="templates" className="block text-sm font-medium text-gray-700">
            Templates (comma-separated numbers)
          </label>
          <input
            type="text"
            id="templates"
            value={templates}
            onChange={(e) => setTemplates(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
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
