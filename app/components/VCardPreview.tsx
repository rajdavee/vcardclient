import React from 'react';
import Image from 'next/image';
import Templates, { TemplateId } from '../basic/components/Templates';

interface VCardPreviewProps {
  templateId: TemplateId;
  fields: Array<{ name: string; value: string }>;
  qrCodeDataUrl?: string;
}

const VCardPreview: React.FC<VCardPreviewProps> = ({ templateId, fields, qrCodeDataUrl }) => {
  // Convert fields array to an object
  const fieldsObject = fields.reduce((acc, field) => {
    acc[field.name] = field.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="vcard-preview">
      <Templates
        selectedTemplate={templateId}
        fields={fieldsObject}
      />
      {qrCodeDataUrl && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">QR Code</h3>
          <div className="relative w-full max-w-[200px] aspect-square">
            <Image 
              src={qrCodeDataUrl} 
              alt="vCard QR Code" 
              layout="fill"
              objectFit="contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                console.error('Failed to load QR code image');
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VCardPreview;