import React, { useState, useRef, useEffect } from 'react';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 200 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      drawImage();
    };
    img.src = image;
  }, [image]);

  const drawImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageRef.current) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'red';
    ctx.strokeRect(crop.x, crop.y, crop.width, crop.height);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setCrop({ ...crop, x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return; // Only drag when mouse button is pressed
    const { offsetX, offsetY } = e.nativeEvent;
    setCrop({
      ...crop,
      width: offsetX - crop.x,
      height: offsetY - crop.y
    });
  };

  const handleMouseUp = () => {
    drawImage();
  };

  const handleCrop = () => {
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');
    if (!ctx || !imageRef.current) return;

    ctx.drawImage(
      imageRef.current,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, crop.width, crop.height
    );
    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(URL.createObjectURL(blob));
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="border border-gray-300"
        />
        <div className="mt-4 flex justify-between">
          <button 
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Cancel
          </button>
          <button 
            onClick={handleCrop}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;