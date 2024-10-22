'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import VCardPreview from '../components/VCardPreview';
import LoadingSpinner from '../components/LoadingSpinner'; // Assume you have this component
import { TemplateId } from '../basic/components/Templates';

interface VCardData {
  templateId: TemplateId;
  fields: { name: string; value: string }[];
  qrCodeDataUrl: string;
}

function PreviewPageContent() {
  const searchParams = useSearchParams();
  const [previewData, setPreviewData] = useState<VCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreviewData = useCallback(async () => {
    const vCardId = searchParams.get('vCardId');
    if (!vCardId) {
      setError('No vCard ID provided');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/vcard-preview/${vCardId}`);
      setPreviewData(response.data);
    } catch (err) {
      console.error('Error fetching vCard preview:', err);
      setError('Failed to load vCard preview');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPreviewData();
  }, [fetchPreviewData]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!previewData) {
    return <div className="text-red-500">No preview data available</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">vCard Preview</h1>
      <VCardPreview previewData={previewData} />
    </div>
  );
}

const PreviewPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PreviewPageContent />
    </Suspense>
  )
};

export default PreviewPage;
