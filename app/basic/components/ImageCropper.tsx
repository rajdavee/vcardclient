import React, { useState, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete: onCropCompleteProp, onCancel: onCancelProp }) => {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  };

  const getCroppedImg = useCallback((image: HTMLImageElement, crop: PixelCrop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        resolve(URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  }, []);

  const handleCropImage = useCallback(async () => {
    if (completedCrop) {
      const img = document.querySelector('img') as HTMLImageElement;
      if (img) {
        const croppedImageUrl = await getCroppedImg(img, completedCrop);
        onCropCompleteProp(croppedImageUrl);
      }
    }
  }, [completedCrop, getCroppedImg, onCropCompleteProp]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-96">
        <div className="w-full">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
          >
            <img src={image} alt="Crop me" onLoad={onImageLoad} />
          </ReactCrop>
        </div>
        <div className="mt-4 flex justify-between">
          <button type="button" onClick={onCancelProp} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button type="button" onClick={handleCropImage} className="px-4 py-2 bg-blue-500 text-white rounded">
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;