'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Templates, { templateFields, TemplateId } from '../basic/components/Templates';
import axios from 'axios';
import { withAuth } from '../utils/withAuth';
import Image from 'next/image';
import * as QRCode from 'qrcode';
import LoadingSpinner from '../components/LoadingSpinner'; // You'll need to create this component

interface FormData {
  [key: string]: string | FileList;
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
  const [scanData, setScanData] = useState<ScanData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const watchedFields = watch();

  useEffect(() => {
    reset();
  }, [selectedTemplate, reset]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        templateId: selectedTemplate,
        fields: Object.entries(data)
          .filter(([key]) => templateFields[selectedTemplate].includes(key))
          .map(([name, value]) => ({ name, value }))
      }));

      if (data.profileImage && data.profileImage instanceof FileList && data.profileImage.length > 0) {
        formData.append('profileImage', data.profileImage[0]);
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
      fetchScanData(response.data.vCardId);
    } catch (error) {
      console.error('Error creating vCard:', error);
      setMessage('Failed to create vCard. Please try again.');
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
      a.download = 'qr-code.png';
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
            <Templates selectedTemplate={templateId} fields={watchedFields} />
          </div>
        ))}
      </div>

      {isLoading && <LoadingSpinner />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-8">
        {renderFormFields()}
        <div>
          <label htmlFor="profileImage" className="block mb-1">Profile Image</label>
          <input type="file" {...register('profileImage')} className="w-full p-2 border rounded" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create vCard</button>
      </form>

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
