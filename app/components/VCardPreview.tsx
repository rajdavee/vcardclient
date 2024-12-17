import React from 'react';
import Image from 'next/image';
import Templates, { TemplateId } from '../basic/components/Templates';

interface VCardPreviewProps {
  previewData: {
    templateId: TemplateId;
    fields: Array<{ name: string; value: string }>;
    qrCodeDataUrl: string;
  };
  showQRCode?: boolean;
}

const VCardPreview: React.FC<VCardPreviewProps> = ({ previewData, showQRCode = true }) => {
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
    <div className="vcard-preview p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300">
      <Templates
        selectedTemplate={templateId}
        fields={fieldsObject}
        croppedImage={profileImageWithTimestamp}
      />
      {showQRCode && qrCodeDataUrl && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2 text-center text-gray-800 dark:text-white">QR Code</h3>
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
            className="mx-auto rounded-lg shadow-md transition-transform transform hover:scale-110 duration-300"
          />
        </div>
      )}
    </div>
  );
};

export default VCardPreview;
