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
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(1);
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

  useEffect(() => {
    reset();
  }, [selectedTemplate, reset]);

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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create Your Pro vCard</h1>
      
      <h2 className="text-2xl font-bold mb-4">Select a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {([1, 2, 3, 4, 5] as const).map((templateId) => (
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

      {isLoading && <LoadingSpinner />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        {renderFormFields()}
        <div>
          <label htmlFor="profileImage" className="block mb-1">Profile Image</label>
          <input type="file" onChange={handleImageSelect} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="skills" className="block mb-1">Key Skills (comma-separated)</label>
          <input
            {...register('skills')}
            className="w-full p-2 border rounded"
            id="skills"
            placeholder="e.g., JavaScript, React, Node.js"
          />
        </div>
        <div>
          <button 
            type="button" 
            onClick={handleGenerateBio}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            disabled={isGeneratingBio}
          >
            {isGeneratingBio ? 'Generating...' : 'Generate AI Bio'}
          </button>
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create vCard'}
          </button>
        </div>
      </form>

      {generatedBio && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-xl font-bold mb-2">Generated Bio</h3>
          <p>{generatedBio}</p>
          <button 
            onClick={() => {
              const bioField = document.getElementById('bio') as HTMLTextAreaElement;
              if (bioField) {
                bioField.value = generatedBio;
              }
            }}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Use This Bio
          </button>
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

      {message && <p className="mt-4 text-green-500">{message}</p>}

      {vCardData && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your vCard</h2>
          <button onClick={downloadVCard} className="bg-green-500 text-white px-4 py-2 rounded mb-4 mr-4">Download vCard</button>
          <button onClick={viewVCardPreview} className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mr-4">View vCard Preview</button>
          <button onClick={copyPreviewLink} className="bg-yellow-500 text-white px-4 py-2 rounded mb-4 mr-4">Copy Preview Link</button>
          {vCardData.qrCodeDataUrl && (
            <>
              <button onClick={downloadQRCode} className="bg-purple-500 text-white px-4 py-2 rounded mb-4">Download QR Code</button>
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">QR Code</h3>
                <Image src={vCardData.qrCodeDataUrl} alt="vCard QR Code" width={200} height={200} />
              </div>
            </>
          )}
          {vCardData.previewLink && (
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">Preview Link</h3>
              <p className="break-all">{vCardData.previewLink}</p>
            </div>
          )}
        </div>
      )}

      {renderScanData()}
    </div>
  );
};

export default withAuth(ProVCardPage, 'Pro');
