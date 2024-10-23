'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { vCardApi } from '../api/vCardApi';
import VCardPreview from '../components/VCardPreview';
import LoadingSpinner from '../components/LoadingSpinner';
import { TemplateId } from '../basic/components/Templates';
import axios from 'axios';

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
      console.log(`Fetching preview data for vCardId: ${vCardId}`);
      const data = await vCardApi.getVCardPreview(vCardId);
      console.log('Received preview data:', data);
      setPreviewData(data);

      // Call handleScan function
      await vCardApi.handleScan(vCardId, 'Preview');
    } catch (err) {
      console.error('Error fetching vCard preview or recording scan:', err);
      if (axios.isAxiosError(err)) {
        setError(`Failed to load vCard preview or record scan: ${err.response?.data?.error || err.message}`);
      } else {
        setError('An unexpected error occurred');
      }
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
