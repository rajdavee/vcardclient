'use client';

import React, { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import VCardPreview from '../components/VCardPreview';
import { TemplateId } from '../basic/components/Templates';
import LoadingSpinner from '../components/LoadingSpinner'; // Assume you have this component

interface VCardData {
  templateId: TemplateId;
  fields: { name: string; value: string }[];
  qrCodeDataUrl: string;
}

function PreviewPageContent() {
  const searchParams = useSearchParams();
  const [vcard, setVcard] = useState<VCardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const startTime = useRef(Date.now());
  const timeRecorded = useRef(false);

  const fetchPreviewData = useCallback(async (vCardId: string) => {
    try {
      const response = await axios.get<VCardData>(`/api/vcard-preview/${vCardId}`);
      setVcard(response.data);
    } catch (error) {
      console.error('Error fetching vCard preview:', error);
      setError('Failed to load vCard preview. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordScan = useCallback(async (vCardId: string) => {
    try {
      await axios.post(`/api/scan/${vCardId}`);
    } catch (error) {
      console.error('Error recording scan:', error);
    }
  }, []);

  const recordTimeSpent = useCallback(async (vCardId: string, timeSpent: number) => {
    try {
      await axios.post(`/api/scan/${vCardId}/time-spent`, { timeSpent });
    } catch (error) {
      console.error('Error recording time spent:', error);
    }
  }, []);

  const recordTimeSpentOnce = useCallback(async (vCardId: string, timeSpent: number) => {
    if (!timeRecorded.current) {
      timeRecorded.current = true;
      await recordTimeSpent(vCardId, Math.round(timeSpent / 1000)); // Keep this in seconds
    }
  }, [recordTimeSpent]);

  useEffect(() => {
    const vCardId = searchParams.get('vCardId');
    if (vCardId) {
      fetchPreviewData(vCardId);
      // Remove this line:
      // recordScan(vCardId);

      const handleBeforeUnload = () => {
        const timeSpent = Date.now() - startTime.current;
        recordTimeSpentOnce(vCardId, timeSpent);
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        const timeSpent = Date.now() - startTime.current;
        recordTimeSpentOnce(vCardId, timeSpent);
      };
    } else {
      setError('No vCard ID provided');
      setIsLoading(false);
    }
  }, [searchParams, fetchPreviewData, recordTimeSpentOnce]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">vCard Preview</h1>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">vCard Preview</h1>
        <div className="text-red-500" role="alert">{error}</div>
      </div>
    );
  }

  if (!vcard) {
    return null; // This should never happen due to the loading state, but it's here for type safety
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">vCard Preview</h1>
      <VCardPreview
        templateId={vcard.templateId}
        fields={vcard.fields}
        qrCodeDataUrl={vcard.qrCodeDataUrl}
      />
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