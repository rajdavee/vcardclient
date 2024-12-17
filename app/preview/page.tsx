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

const PreviewPageContent: React.FC = () => {
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

      // Call handleScan function only after successful preview fetch
      await vCardApi.handleScan(vCardId, 'Preview');
    } catch (err) {
      console.error('Error fetching vCard preview:', err);
      if (axios.isAxiosError(err)) {
        setError(`Failed to load vCard preview: ${err.response?.data?.error || err.message}`);
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
    
  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,_hsla(192,_80%,_51%,_1),_hsla(355,_85%,_63%,_1))] flex items-center justify-center">
      <div className="container mx-auto p-6">
        {loading && <LoadingSpinner />}
        {error && <div className="text-red-500 text-lg font-semibold text-center">{error}</div>}
        {!loading && !error && !previewData && (
          <div className="text-red-500 text-lg font-semibold text-center">No preview data available</div>
        )}
        {previewData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-transform transform hover:scale-105 duration-300">
            <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-white text-center">vCard Preview</h1>
            <div className="flex flex-col items-center mb-6">
              <VCardPreview previewData={previewData} showQRCode={false} />
            </div>
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md transition-transform transform hover:scale-105 duration-300">
                <img src={previewData.qrCodeDataUrl} alt="QR Code" className="w-40 h-40 rounded-lg shadow-md" />
                <p className="text-center text-gray-600 dark:text-gray-300 mt-2">Scan to view vCard</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-gray-600 dark:text-gray-300 text-center">This is how your vCard will look.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const PreviewPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PreviewPageContent />
    </Suspense>
  );
};

export default PreviewPage;
