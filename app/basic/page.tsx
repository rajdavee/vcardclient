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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create Your vCard</h1>
      
      <h2 className="text-2xl font-bold mb-4">Select a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {availableTemplates.map((templateId) => (
          <div
            key={templateId}
            className={`border p-4 rounded-lg cursor-pointer ${selectedTemplate === templateId ? 'border-blue-500' : ''}`}
            onClick={() => setSelectedTemplate(templateId)}
          >
            <h3 className="text-xl font-bold mb-2">Template {templateId}</h3>
            <Templates 
              selectedTemplate={templateId} 
              fields={watchedFields} 
              croppedImage={croppedImageUrl}
            />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        {renderFormFields()}
        <div>
          <label htmlFor="profileImage" className="block mb-1">Profile Image</label>
          <input type="file" onChange={handleImageSelect} className="w-full p-2 border rounded" />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create vCard'}
        </button>
      </form>

      {isSubmitting && <p>Creating your vCard...</p>}
      {message && <p className="mt-4 text-green-500">{message}</p>}

      {vCardData && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your vCard</h2>
          <button onClick={downloadVCard} className="bg-green-500 text-white px-4 py-2 rounded mb-4 mr-4">Download vCard</button>
          <button onClick={viewVCardPreview} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mr-4">View vCard Preview</button>
          <button onClick={copyPreviewLink} className="bg-yellow-500 text-white px-4 py-2 rounded mb-4 mr-4">Copy Preview Link</button>
          {vCardData.qrCodeDataUrl && (
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">QR Code (Scan to add contact)</h3>
              <p className="mb-2">Scan this QR code with your phone's camera to add the contact.</p>
              <img src={vCardData.qrCodeDataUrl} alt="Contact QR Code" width={200} height={200} />
            </div>
          )}
          {vCardData.previewLink && (
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">Preview Link</h3>
              <p className="break-all">{vCardData.previewLink}</p>
            </div>
          )}
        </div>
      )}
      {cropImage && (
        <div>
          <ImageCropper
            image={cropImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
          <button 
            onClick={() => document.querySelector<HTMLElement>('.ReactCrop__crop-btn')?.click()}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Crop Image
          </button>
        </div>
      )}
    </div>
  );
};

export default withAuth(BasicVCardPage, 'basic');
