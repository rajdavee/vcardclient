import React, { useState } from 'react';
import { Eye, Download, Share2, MoreVertical, Maximize2, QrCode } from 'lucide-react';
import VCardPreview from '../../components/VCardPreview';
import { TemplateId } from '@/app/basic/components/Templates';

interface VCardField {
  name: string;
  value: string;
}

interface VCard {
  _id: string;
  templateId: number;
  fields: VCardField[];
  qrCode: string;
  createdAt?: string;
  lastUpdated?: string;
  scanCount?: number;
}

interface UserVCardsProps {
  vCards: VCard[];
  onShare?: (vCardId: string) => void;
  onDownload?: (vCardId: string) => void;
}

const UserVCards: React.FC<UserVCardsProps> = ({ vCards, onShare, onDownload }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<string | null>(null);

  const handleExpand = (vCardId: string) => {
    setExpandedCard(expandedCard === vCardId ? null : vCardId);
  };

  const handleShowQR = (vCardId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowQR(showQR === vCardId ? null : vCardId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {vCards.map((vCard) => (
        <div 
          key={vCard._id} 
          className={`group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${
            expandedCard === vCard._id ? 'col-span-2 row-span-2' : ''
          }`}
        >
          {/* Card Header */}
          <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/50 to-transparent z-10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm font-medium">
                Template {vCard.templateId}
              </span>
              {vCard.scanCount !== undefined && (
                <span className="text-white/80 text-xs">
                  {vCard.scanCount} scans
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => handleShowQR(vCard._id, e)}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <QrCode size={16} />
              </button>
              <button 
                onClick={() => handleExpand(vCard._id)}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* VCard Preview */}
          <div className="relative">
            <VCardPreview
              previewData={{
                templateId: vCard.templateId as TemplateId,
                fields: vCard.fields,
                qrCodeDataUrl: vCard.qrCode
              }}
            />

            {/* Action Buttons */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onShare && (
                <button 
                  onClick={() => onShare(vCard._id)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <Share2 size={16} />
                </button>
              )}
              {onDownload && (
                <button 
                  onClick={() => onDownload(vCard._id)}
                  className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                  <Download size={16} />
                </button>
              )}
            </div>
          </div>

          {/* QR Code Modal */}
          {showQR === vCard._id && (
            <div 
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowQR(null)}
            >
              <div 
                className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full mx-4"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">QR Code</h3>
                <img 
                  src={vCard.qrCode} 
                  alt="QR Code" 
                  className="w-full h-auto"
                />
                <button 
                  onClick={() => setShowQR(null)}
                  className="mt-4 w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserVCards;
