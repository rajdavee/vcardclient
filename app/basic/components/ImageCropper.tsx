import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel }) => {
  const [scale, setScale] = useState(1);
  const editorRef = useRef<AvatarEditor>(null);

  const handleScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value);
    setScale(scale);
  };

  const handleSave = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        if (blob) {
          const croppedImageUrl = URL.createObjectURL(blob);
          onCropComplete(croppedImageUrl);
        }
      }, 'image/jpeg');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg">
        <AvatarEditor
          ref={editorRef}
          image={image}
          width={250}
          height={250}
          border={50}
          scale={scale}
        />
        <div className="mt-4">
          <input
            type="range"
            onChange={handleScale}
            min={1}
            max={2}
            step={0.01}
            defaultValue={1}
            className="w-full"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;