import React from 'react';
import VCardPreview from '../../components/VCardPreview';
import { TemplateId } from '@/app/basic/components/Templates';

interface UserVCardsProps {
  vCards: Array<{
    _id: string;
    templateId: number;
    fields: Array<{ name: string; value: string }>;
    qrCode: string;
  }>;
}

const UserVCards: React.FC<UserVCardsProps> = ({ vCards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {vCards.map((vCard) => (
        <div key={vCard._id} className="border rounded-lg overflow-hidden shadow-lg">
          <VCardPreview
            previewData={{
              templateId: vCard.templateId as TemplateId,
              fields: vCard.fields,
              qrCodeDataUrl: vCard.qrCode
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default UserVCards;
