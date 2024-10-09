'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import VCardPreview from '../components/VCardPreview';
import { TemplateId } from '../basic/components/Templates';

interface VCardData {
  templateId: TemplateId;  // Changed from number to TemplateId
  fields: { name: string; value: string }[];
  qrCodeDataUrl: string;
}

function PreviewPageContent() {
  const searchParams = useSearchParams();
  const [vcard, setVcard] = useState<VCardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPreviewData = useCallback(async (vCardId: string) => {
    try {
      const response = await axios.get<VCardData>(`/api/vcard?id=${vCardId}&preview=true`);
      setVcard(response.data);
    } catch (error) {
      console.error('Error fetching vCard preview:', error);
      setError('Failed to load vCard preview');
    }
  }, []);

  useEffect(() => {
    const vCardId = searchParams.get('vCardId');
    if (vCardId) {
      fetchPreviewData(vCardId);
    } else {
      setError('No vCard ID provided');
    }
  }, [searchParams, fetchPreviewData]);

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">vCard Preview</h1>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!vcard) {
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
        templateId={vcard.templateId}
        fields={vcard.fields}
        qrCodeDataUrl={vcard.qrCodeDataUrl}
      />
    </div>
  );
}

const PreviewPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewPageContent />
    </Suspense>
  )
};

export default PreviewPage;