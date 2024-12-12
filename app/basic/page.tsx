'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Templates, { templateFields, TemplateId } from './components/Templates';
import axios from 'axios';
import { withAuth } from '../utils/withAuth';
import Image from 'next/image';
import ImageCropper from './components/ImageCropper';
import api from '../utils/api';

interface FormData {
  [key: string]: string | FileList;
}

interface VCardData {
  vCardString: string;
  qrCodeDataUrl: string;
  vCardId: string;
  previewLink: string;
}

const BasicVCardPage: React.FC = () => {
  const { register, handleSubmit, watch, reset } = useForm<FormData>();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(1);
  const [vCardData, setVCardData] = useState<VCardData | null>(null);
  const [message, setMessage] = useState<string>('');
  const watchedFields = watch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [availableTemplates, setAvailableTemplates] = useState<TemplateId[]>([]);

  useEffect(() => {
    reset();
  }, [selectedTemplate, reset]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await api.get('/auth/user-info', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('User info response:', response.data);

        const templates = response.data.plan.availableTemplates || [1];
        setAvailableTemplates(templates);
        setSelectedTemplate(templates[0]); // Set the first available template as default
        console.log('Available templates:', templates);
      } catch (error) {
        console.error('Error fetching user info:', error instanceof Error ? error : new Error(String(error)));
        // Add more detailed error logging here
        if (error instanceof Error && 'response' in error) {
          console.error('Response data:', (error as any).response.data);
          console.error('Response status:', (error as any).response.status);
          console.error('Response headers:', (error as any).response.headers);
        } else if (error instanceof Error && 'request' in error) {
          if (error instanceof Error && 'request' in error) {
            console.error('No response received:', error.request);
          } else {
            console.error('Error setting up request:');
          }
        }
      }
    };

    fetchUserInfo();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        templateId: selectedTemplate,
        fields: Object.entries(data)
          .filter(([key]) => templateFields[selectedTemplate].includes(key))
          .map(([name, value]) => ({ name, value }))
      }));

      if (croppedImageUrl) {
        const response = await fetch(croppedImageUrl);
        const blob = await response.blob();
        formData.append('profileImage', blob, 'profile.jpg');
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post('/api/vcard', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      setVCardData(response.data);
      setMessage('vCard created successfully!');
      reset();
      setCroppedImageUrl(null);
      setCropImage(null);

      // Add a short delay before redirecting to the preview page
      setTimeout(() => {
        viewVCardPreview();
      }, 1000); // 1 second delay
    } catch (error) {
      console.error('Error creating vCard:', error);
      setMessage('Failed to create vCard. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadVCard = () => {
    if (vCardData && vCardData.vCardString) {
      const blob = new Blob([vCardData.vCardString], { type: 'text/vcard' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contact.vcf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } else {
      console.error('vCard data is not available');
      setMessage('Unable to download vCard. Please try again.');
    }
  };

  const downloadQRCode = () => {
    if (vCardData && vCardData.qrCodeDataUrl) {
      const a = document.createElement('a');
      a.href = vCardData.qrCodeDataUrl;
      a.download = 'vcard_qr_code.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.error('QR code data is not available');
      setMessage('Unable to download QR code. Please try again.');
    }
  };

  const viewVCardPreview = () => {
    if (vCardData && vCardData.vCardId) {
      window.open(`/preview?vCardId=${vCardData.vCardId}`, '_blank');
    }
  };

  const copyPreviewLink = () => {
    if (vCardData && vCardData.previewLink) {
      navigator.clipboard.writeText(vCardData.previewLink)
        .then(() => {
          setMessage('Preview link copied to clipboard!');
        })
        .catch((error) => {
          console.error('Failed to copy preview link:', error);
          setMessage('Failed to copy preview link. Please try again.');
        });
    } else {
      console.error('Preview link is not available');
      setMessage('Unable to copy preview link. Please try again.');
    }
  };

  const renderFormFields = () => {
    return templateFields[selectedTemplate].map((field) => (
      <div key={field}>
        <label htmlFor={field} className="block mb-1">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
        <input
          {...register(field)}
          className="w-full p-2 border rounded"
          id={field}
        />
      </div>
    ));
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setCropImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setCroppedImageUrl(croppedImageUrl);
    setCropImage(null);
  };

  const handleCropCancel = () => {
    setCropImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Create Your Digital Business Card</h1>
          <p className="text-gray-600 mt-2">Design your personalized vCard</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Template Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Choose Your Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTemplates.map((templateId) => (
              <div
                key={templateId}
                onClick={() => setSelectedTemplate(templateId)}
                className={`
                  relative rounded-lg overflow-hidden transition-all duration-200 cursor-pointer
                  ${selectedTemplate === templateId 
                    ? 'ring-2 ring-blue-500 shadow-lg transform scale-[1.02]' 
                    : 'hover:shadow-md hover:transform hover:scale-[1.01]'
                  }
                `}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <Templates 
                    selectedTemplate={templateId} 
                    fields={watchedFields}
                    croppedImage={croppedImageUrl}
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-medium">Template {templateId}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form and Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderFormFields()}
                </div>

                {/* Image Upload Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Image</h3>
                  <div className="flex items-center space-x-4">
                    {croppedImageUrl && (
                      <div className="w-20 h-20 rounded-full overflow-hidden">
                        <Image src={croppedImageUrl} alt="Profile" width={80} height={80} className="object-cover" />
                      </div>
                    )}
                    <label className="flex-1">
                      <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <span className="font-medium text-gray-600">
                            Drop files to Attach, or browse
                          </span>
                        </span>
                        <input type="file" onChange={handleImageSelect} className="hidden" />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t pt-6">
                  <button 
                    type="submit" 
                    className={`
                      w-full flex items-center justify-center px-4 py-3 rounded-md text-white text-lg font-medium
                      ${isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      }
                    `}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create vCard'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview & Actions Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Preview & Actions</h3>
                {vCardData ? (
                  <div className="space-y-4">
                    {vCardData.qrCodeDataUrl && (
                      <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                        <Image src={vCardData.qrCodeDataUrl} alt="QR Code" width={200} height={200} />
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-3">
                      <button onClick={downloadVCard} className="btn-primary">Download vCard</button>
                      <button onClick={viewVCardPreview} className="btn-secondary">Preview vCard</button>
                      <button onClick={copyPreviewLink} className="btn-outline">Copy Share Link</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    Create your vCard to see preview and actions
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {cropImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <ImageCropper
              image={cropImage}
              onCropComplete={handleCropComplete}
              onCancel={handleCropCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Add these styles to your global CSS file
const globalStyles = `
  .btn-primary {
    @apply w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
  }
  
  .btn-secondary {
    @apply w-full px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors;
  }
  
  .btn-outline {
    @apply w-full px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-md hover:border-gray-400 transition-colors;
  }
`;

export default withAuth(BasicVCardPage, 'basic');
