'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import VCardPreview from '../components/VCardPreview';

const PreviewPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [previewData, setPreviewData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const vCardId = searchParams.get('vCardId');
    if (vCardId) {
      fetchPreviewData(vCardId);
    } else {
      setError('No vCard ID provided');
    }
  }, [searchParams]);

  const fetchPreviewData = async (vCardId: string) => {
    try {
      const response = await axios.get(`/api/vcard?id=${vCardId}&preview=true`);
      setPreviewData(response.data);
    } catch (error) {
      console.error('Error fetching vCard preview:', error);
      setError('Failed to load vCard preview');
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">vCard Preview</h1>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!previewData) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">vCard Preview</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">vCard Preview</h1>
      <VCardPreview
        templateId={previewData.templateId}
        fields={previewData.fields}
        qrCodeDataUrl={previewData.qrCodeDataUrl}
      />
    </div>
  );
};

export default PreviewPage;