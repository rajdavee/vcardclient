'use client'
import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { updatePlanTemplates } from '../../api/admin';
import Templates, { TemplateId, templateFields } from '../../basic/components/Templates';
import { theme } from '../theme-constants';

interface PlanTemplate {
  id: TemplateId;
  name: string;
  description: string;
}

const PlanTemplateManagement: React.FC = () => {
  const [planName, setPlanName] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<TemplateId[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'pro' | 'enterprise'>('basic');

  const plans = {
    basic: { name: 'Basic', color: 'bg-blue-100 text-blue-800' },
    pro: { name: 'Pro', color: 'bg-purple-100 text-purple-800' },
    enterprise: { name: 'Enterprise', color: 'bg-green-100 text-green-800' },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName) {
      setError('Please select a plan');
      return;
    }
    if (selectedTemplates.length === 0) {
      setError('Please select at least one template');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const response = await updatePlanTemplates(planName, selectedTemplates);
      setMessage(`Successfully updated templates for ${planName}. ${response.updatedCount} users affected.`);
      setTimeout(() => setMessage(''), 5000); // Clear success message after 5 seconds
    } catch (err) {
      setError('Failed to update plan templates. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTemplate = (templateId: TemplateId) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plan Template Management</h2>
          <p className="text-gray-500 mt-1">Configure templates available for each subscription plan</p>
        </div>
        <CreditCard className="text-primary-main" size={32} />
      </div>

      {/* Plan Selection Tabs */}
      <div className="flex space-x-2 mb-6">
        {Object.entries(plans).map(([key, plan]) => (
          <button
            key={key}
            onClick={() => {
              setActiveTab(key as any);
              setPlanName(plan.name);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? `${plan.color} shadow-sm`
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {plan.name}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(templateFields).map((templateId) => (
            <div 
              key={templateId}
              className={`group relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                selectedTemplates.includes(Number(templateId) as TemplateId)
                  ? 'ring-2 ring-primary-main shadow-lg'
                  : 'hover:shadow-md border border-gray-200'
              }`}
              onClick={() => toggleTemplate(Number(templateId) as TemplateId)}
            >
              {/* Template Preview */}
              <div className="relative">
                <Templates
                  selectedTemplate={Number(templateId) as TemplateId}
                  fields={dummyFields}
                  croppedImage={null}
                />
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
                  selectedTemplates.includes(Number(templateId) as TemplateId) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="font-medium">Template {templateId}</p>
                    <p className="text-sm opacity-80">Click to {selectedTemplates.includes(Number(templateId) as TemplateId) ? 'remove' : 'select'}</p>
                  </div>
                </div>
              </div>

              {/* Selection Indicator */}
              <div className={`absolute top-3 right-3 p-1 rounded-full ${
                selectedTemplates.includes(Number(templateId) as TemplateId)
                  ? 'bg-primary-main text-white'
                  : 'bg-white/80 text-gray-400'
              }`}>
                <CheckCircle size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Status Messages */}
        {message && (
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="text-green-500 mr-2" size={20} />
            <p className="text-green-700">{message}</p>
          </div>
        )}
        {error && (
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex items-center px-6 py-3 rounded-lg text-white bg-primary-main hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2" size={20} />
                Updating Templates...
              </>
            ) : (
              'Update Plan Templates'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanTemplateManagement;