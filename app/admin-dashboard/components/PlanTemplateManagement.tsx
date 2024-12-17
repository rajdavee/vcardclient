'use client'
import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, AlertCircle, Loader2, Sparkles, Building2, Rocket, Info, Shield, Users } from 'lucide-react';
import { updatePlanTemplates } from '../../api/admin';
import Templates, { TemplateId, templateFields } from '../../basic/components/Templates';

const PlanTemplateManagement: React.FC = () => {
  const [planName, setPlanName] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<TemplateId[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);

  const plans = {
    basic: { 
      name: 'Basic', 
      color: 'bg-blue-100 text-blue-800',
      hoverColor: 'hover:bg-blue-50',
      icon: Building2,
      description: 'Essential templates for individuals',
      features: ['Up to 3 templates', 'Basic customization', 'Standard support']
    },
    pro: { 
      name: 'Pro', 
      color: 'bg-purple-100 text-purple-800',
      hoverColor: 'hover:bg-purple-50',
      icon: Rocket,
      description: 'Advanced templates for professionals',
      features: ['Up to 8 templates', 'Advanced customization', 'Priority support']
    },
    enterprise: { 
      name: 'Enterprise', 
      color: 'bg-green-100 text-green-800',
      hoverColor: 'hover:bg-green-50',
      icon: Sparkles,
      description: 'Custom templates for organizations',
      features: ['Unlimited templates', 'Full customization', '24/7 support']
    },
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header Section */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              Plan Template Management
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-gray-600 dark:text-gray-400">
              Configure and manage templates available for each subscription plan
            </p>
            <button 
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              onClick={() => alert('Help information')}
            >
              <Info className="h-4 w-4 ml-1" />
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          {/* Plan Selection Cards */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(plans).map(([key, plan]) => {
                const Icon = plan.icon;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTab(key as any);
                      setPlanName(plan.name);
                    }}
                    className={`relative group flex flex-col p-6 rounded-lg transition-all ${
                      activeTab === key
                        ? `${plan.color} shadow-md`
                        : `text-gray-500 ${plan.hoverColor} border border-gray-200 dark:border-gray-700`
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="h-6 w-6" />
                      <h3 className="font-semibold text-lg">{plan.name}</h3>
                    </div>
                    <p className="text-sm mb-4">{plan.description}</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {activeTab === key && (
                      <div className="absolute -right-1 -top-1">
                        <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          Active
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Template Selection Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Available Templates
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select templates to include in the {activeTab} plan
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Shield className="h-4 w-4" />
                <span>{selectedTemplates.length} templates selected</span>
              </div>
            </div>

            {/* Enhanced Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {Object.keys(templateFields).map((templateId) => (
                <div 
                  key={templateId}
                  className={`group relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedTemplates.includes(Number(templateId) as TemplateId)
                      ? 'ring-2 ring-blue-500 shadow-lg dark:ring-blue-400'
                      : 'hover:shadow-xl border border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => toggleTemplate(Number(templateId) as TemplateId)}
                  onMouseEnter={() => setHoveredTemplate(Number(templateId))}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <div className="relative bg-white dark:bg-gray-800">
                    <Templates
                      selectedTemplate={Number(templateId) as TemplateId}
                      fields={dummyFields}
                      croppedImage={null}
                    />
                    {/* Enhanced Hover Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 ${
                      hoveredTemplate === Number(templateId) ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="font-medium text-lg">Template {templateId}</p>
                        <p className="text-sm opacity-90">
                          {selectedTemplates.includes(Number(templateId) as TemplateId) 
                            ? 'Click to remove from plan' 
                            : 'Click to add to plan'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Selection Indicator */}
                  <div className={`absolute top-3 right-3 p-1.5 rounded-full transition-all duration-300 ${
                    selectedTemplates.includes(Number(templateId) as TemplateId)
                      ? 'bg-blue-500 text-white scale-100'
                      : 'bg-white/90 text-gray-400 scale-90 group-hover:scale-100'
                  }`}>
                    <CheckCircle size={20} />
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Status Messages */}
            {(message || error) && (
              <div className="mb-6">
                {message && (
                  <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="text-green-500 dark:text-green-400 mr-2" size={20} />
                    <p className="text-green-700 dark:text-green-300">{message}</p>
                  </div>
                )}
                {error && (
                  <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="text-red-500 dark:text-red-400 mr-2" size={20} />
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Submit Button */}
            <div className="flex items-center justify-end gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <Users className="inline-block h-4 w-4 mr-1" />
                Changes will affect all {activeTab} plan users
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2" size={20} />
                    Updating Templates...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Update Plan Templates
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlanTemplateManagement;