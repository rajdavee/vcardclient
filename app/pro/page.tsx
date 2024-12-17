'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Templates, { templateFields, TemplateId } from '../basic/components/Templates';
import axios from 'axios';
import { withAuth } from '../utils/withAuth';
import Image from 'next/image';
import * as QRCode from 'qrcode';
import LoadingSpinner from '../components/LoadingSpinner';  
import ImageCropper from '../basic/components/ImageCropper';
import { generateBio } from '../utils/geminiClient';
import api from '../utils/api';

interface FormData {
  [key: string]: string | FileList | undefined;
  name?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  skills?: string;
  // Add other specific fields as needed
}

interface VCardData {
  vCardId: string;
  vCardString: string;
  qrCodeDataUrl: string;
  previewLink: string;
}

interface ScanData {
  totalScans: number; 
  recentScans: Array<{
    scanDate: string;
    location: {
      city: string;
      country: string;
    };
  }>;
  locationBreakdown: {
    [key: string]: number;
  };
  deviceBreakdown: {
    [key: string]: number;
  };
}

const ProVCardPage: React.FC = () => {
  const { register, handleSubmit, watch, reset } = useForm<FormData>();
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(1);
  const [vCardData, setVCardData] = useState<VCardData | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const watchedFields = watch();
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
  const [generatedBio, setGeneratedBio] = useState<string>('');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
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
        }
        setMessage('Failed to fetch user info. Please try again.');
      }
    };

    fetchUserInfo();
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (selectedTemplate === null) {
      setMessage('Please select a template before submitting.');
      return; // Prevent submission if no template is selected
    }

    setIsSubmitting(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        templateId: selectedTemplate,
        fields: Object.entries(data)
          .filter(([key]) => templateFields[selectedTemplate]?.includes(key))
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
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessage(`Failed to create vCard: ${error.response.data.error || 'Unknown error'}`);
        } else if (error.request) {
          setMessage('Failed to create vCard: No response received from server');
        } else {
          setMessage(`Failed to create vCard: ${error.message}`);
        }
      } else {
        setMessage('Failed to create vCard. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchScanData = async (vCardId: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get<ScanData>(`/api/auth/vcard-analytics/${vCardId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setScanData(response.data);
    } catch (error) {
      console.error('Error fetching scan data:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setMessage(`Failed to fetch scan data: ${error.response.data.error || 'Unknown error'}`);
        } else if (error.request) {
          setMessage('Failed to fetch scan data: No response received from server');
        } else {
          setMessage(`Failed to fetch scan data: ${error.message}`);
        }
      } else {
        setMessage('Failed to fetch scan data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadVCard = () => {
    if (vCardData && vCardData.vCardString) {
      const blob = new Blob([vCardData.vCardString], { type: 'text/vcard' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
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
        .then(() => setMessage('Preview link copied to clipboard!'))
        .catch(() => setMessage('Failed to copy preview link. Please try again.'));
    }
  };

  const renderFormFields = () => {
    if (selectedTemplate === null) {
      return null; // or return an empty array if you want to render nothing
    }

    return templateFields[selectedTemplate].map((field) => (
      <div key={field}>
        <label htmlFor={field} className="block mb-1">
          {field.charAt(0).toUpperCase() + field.slice(1)}
        </label>
        <input
          {...register(field)}
          className="w-full p-2 border rounded"
          id={field}
        />
      </div>
    ));
  };

  const renderScanData = () => {
    if (!scanData) return null;

    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Scan Analytics</h2>
        <p>Total Scans: {scanData.totalScans}</p>
        <h3 className="text-xl font-bold mt-4 mb-2">Recent Scans</h3>
        <ul>
          {scanData.recentScans.map((scan, index) => (
            <li key={index}>
              {scan.scanDate} - {scan.location.city}, {scan.location.country}
            </li>
          ))}
        </ul>
        <h3 className="text-xl font-bold mt-4 mb-2">Location Breakdown</h3>
        <ul>
          {Object.entries(scanData.locationBreakdown).map(([location, count]) => (
            <li key={location}>
              {location}: {count}
            </li>
          ))}
        </ul>
        <h3 className="text-xl font-bold mt-4 mb-2">Device Breakdown</h3>
        <ul>
          {Object.entries(scanData.deviceBreakdown).map(([device, count]) => (
            <li key={device}>
              {device}: {count}
            </li>
          ))}
        </ul>
      </div>
    );
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

  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    try {
      const name = watchedFields.name as string || `${watchedFields.firstName as string} ${watchedFields.lastName as string}`;
      const jobTitle = watchedFields.jobTitle as string || '';
      const skills = typeof watchedFields.skills === 'string' 
        ? watchedFields.skills 
        : '';
      const bio = await generateBio(name, jobTitle, skills);
      setGeneratedBio(bio);
    } catch (error) {
      console.error('Error generating bio:', error);
      setMessage('Failed to generate bio. Please try again.');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Create Your Professional vCard</h1>
          <p className="text-gray-600 mt-2">Design and customize your digital business card</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Template Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Choose Your Template</h2>
          {selectedTemplate ? (
            <div className="flex justify-center items-center h-full">
              <div className="relative w-full max-w-3xl">
                <div
                  key={selectedTemplate}
                  onClick={() => setSelectedTemplate(selectedTemplate)}
                  className={`
                    relative rounded-lg overflow-hidden transition-all duration-200 cursor-pointer
                    ring-2 ring-blue-500 shadow-lg transform scale-[1.02] w-full
                  `}
                >
                  <div className="aspect-w-16 aspect-h-9 w-full h-full">
                    <Templates 
                      selectedTemplate={selectedTemplate} 
                      fields={watchedFields}
                      croppedImage={croppedImageUrl}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-medium">Template {selectedTemplate}</h3>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTemplates.map((templateId) => (
                <div
                  key={templateId}
                  onClick={() => setSelectedTemplate(templateId)}
                  className={`
                    relative rounded-lg overflow-hidden transition-all duration-200 cursor-pointer
                    ring-2 ring-blue-500 shadow-lg transform scale-[1.02]
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
          )}
          <div className="mt-4 flex justify-center">
            <button 
              onClick={() => setSelectedTemplate(null)} 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Change Template
            </button>
          </div>
        </div>

        {/* Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {selectedTemplate ? (
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

                  {/* AI Bio Generation */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">AI Bio Generation</h3>
                    <div className="space-y-4">
                      <button 
                        type="button" 
                        onClick={handleGenerateBio}
                        className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white ${isGeneratingBio ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}`}
                        disabled={isGeneratingBio}
                      >
                        {isGeneratingBio ? (
                          <>
                            <LoadingSpinner />
                            Generating...
                          </>
                        ) : (
                          'Generate AI Bio'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="border-t pt-6">
                    <button 
                      type="submit" 
                      className={`w-full flex items-center justify-center px-4 py-3 rounded-md text-white text-lg font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner />
                          Creating...
                        </>
                      ) : (
                        'Create vCard'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Please select a template first to view form.</p>
                </div>
              )}
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
                      <button 
                        onClick={downloadVCard} 
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Download vCard
                      </button>
                      <button 
                        onClick={viewVCardPreview} 
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Preview vCard
                      </button>
                      <button 
                        onClick={copyPreviewLink} 
                        className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Copy Share Link
                      </button>
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

          {/* Analytics Section */}
          {scanData && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Analytics Dashboard</h2>
              <p>Total Scans: {scanData.totalScans}</p>
              <h3 className="text-xl font-bold mt-4 mb-2">Recent Scans</h3>
              <ul>
                {scanData.recentScans.map((scan, index) => (
                  <li key={index}>
                    {scan.scanDate} - {scan.location.city}, {scan.location.country}
                  </li>
                ))}
              </ul>
              <h3 className="text-xl font-bold mt-4 mb-2">Location Breakdown</h3>
              <ul>
                {Object.entries(scanData.locationBreakdown).map(([location, count]) => (
                  <li key={location}>
                    {location}: {count}
                  </li>
                ))}
              </ul>
              <h3 className="text-xl font-bold mt-4 mb-2">Device Breakdown</h3>
              <ul>
                {Object.entries(scanData.deviceBreakdown).map(([device, count]) => (
                  <li key={device}>
                    {device}: {count}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
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

export default withAuth(ProVCardPage, 'Pro');
