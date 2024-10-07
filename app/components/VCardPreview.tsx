import React from 'react';
import Image from 'next/image';
import Templates from '../basic/components/Templates';

interface VCardPreviewProps {
  templateId: number;
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
    <div>
      <Templates 
        selectedTemplate={templateId}
        onSelectTemplate={() => {}}
        fields={fieldsObject} 
      />
      {qrCodeDataUrl && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">QR Code</h3>
          <Image src={qrCodeDataUrl} alt="vCard QR Code" width={200} height={200} />
        </div>
      )}
    </div>
  );
};

export default VCardPreview;