// import React, { useState, useCallback } from 'react';
// import Cropper from 'react-easy-crop';

// interface Point {
//   x: number;
//   y: number;
// }

// interface Area {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
// }

// interface ImageCropperProps {
//   image: string;
//   onCropComplete: (croppedImageUrl: string) => void;
//   onCancel: () => void;
// }

// const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropComplete: onCropCompleteProp, onCancel: onCancelProp }) => {
//   const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

//   const onCropChange = (crop: Point) => {
//     setCrop(crop);
//   };

//   const onZoomChange = (zoom: number) => {
//     setZoom(zoom);
//   };

//   const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
//     setCroppedAreaPixels(croppedAreaPixels);
//   }, []);

//   const createImage = (url: string): Promise<HTMLImageElement> =>
//     new Promise((resolve, reject) => {
//       const image = new Image();
//       image.addEventListener('load', () => resolve(image));
//       image.addEventListener('error', error => reject(error));
//       image.src = url;
//     });

//   const getCroppedImg = async (imageSrc: string, pixelCrop: Area) => {
//     const image = await createImage(imageSrc);
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');

//     if (!ctx) {
//       return null;
//     }

//     canvas.width = pixelCrop.width;
//     canvas.height = pixelCrop.height;

//     ctx.drawImage(
//       image,
//       pixelCrop.x,
//       pixelCrop.y,
//       pixelCrop.width,
//       pixelCrop.height,
//       0,
//       0,
//       pixelCrop.width,
//       pixelCrop.height
//     );

//     return new Promise<string>((resolve) => {
//       canvas.toBlob((blob) => {
//         if (!blob) {
//           console.error('Canvas is empty');
//           return;
//         }
//         resolve(URL.createObjectURL(blob));
//       }, 'image/jpeg');
//     });
//   };

//   const handleCropImage = async () => {
//     if (croppedAreaPixels) {
//       const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels);
//       if (croppedImageUrl) {
//         onCropCompleteProp(croppedImageUrl);
//       }
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-4 rounded-lg w-96 h-96">
//         <div className="relative w-full h-80">
//           <Cropper
//             image={image}
//             crop={crop}
//             zoom={zoom}
//             aspect={1}
//             onCropChange={onCropChange}
//             onZoomChange={onZoomChange}
//             onCropComplete={onCropComplete}
//           />
//         </div>
//         <div className="mt-4 flex justify-between">
//           <button type="button" onClick={onCancelProp} className="px-4 py-2 bg-gray-200 rounded">
//             Cancel
//           </button>
//           <button type="button" onClick={handleCropImage} className="px-4 py-2 bg-blue-500 text-white rounded">
//             Crop
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageCropper;
