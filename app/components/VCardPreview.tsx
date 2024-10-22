import React from 'react';
import Image from 'next/image';
import Templates, { TemplateId } from '../basic/components/Templates';

interface VCardPreviewProps {
  previewData: {
    templateId: TemplateId;
    fields: Array<{ name: string; value: string }>;
    qrCodeDataUrl: string;
  };
}

const VCardPreview: React.FC<VCardPreviewProps> = ({ previewData }) => {
  const { templateId, fields, qrCodeDataUrl } = previewData;

  // Convert fields array to an object
  const fieldsObject = fields.reduce((acc, field) => {
    acc[field.name] = field.value;
    return acc;
  }, {} as Record<string, string>);

  // Find the profileImage field
  const profileImage = fields.find(field => field.name === 'profileImage')?.value || null;

  // Add a timestamp to the image URL to force a refresh
  const profileImageWithTimestamp = profileImage ? `${profileImage}?t=${Date.now()}` : null;

  return (
    <div className="vcard-preview">
      <Templates
        selectedTemplate={templateId}
        fields={fieldsObject}
        croppedImage={profileImageWithTimestamp}
      />
      {qrCodeDataUrl && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">QR Code</h3>
          <Image 
            src={qrCodeDataUrl} 
            alt="vCard QR Code" 
            width={200} 
            height={200}
            unoptimized // Add this to bypass Next.js image optimization
            onError={(e) => {
              console.error('Failed to load QR code image');
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default VCardPreview;
