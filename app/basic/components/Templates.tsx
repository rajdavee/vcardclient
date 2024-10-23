import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export type TemplateId = number; // Instead of 1 | 2 | 3 | 4 | 5

interface TemplateProps {
  selectedTemplate: TemplateId;
  fields: Record<string, any>;
  croppedImage: string | null;
}

export const templateFields: Record<number, string[]> = {
  1: ['name', 'jobTitle', 'phone', 'email', 'website', 'address', 'bio'],
  2: ['name', 'jobTitle', 'phone', 'email', 'website', 'address', 'city', 'postalCode', 'bio'],
  3: ['name', 'jobTitle', 'phone', 'email', 'website', 'address', 'workHours', 'bio'],
  4: ['firstName', 'lastName', 'jobTitle', 'phone', 'email', 'website', 'address', 'bio'],
  5: ['firstName', 'lastName', 'jobTitle', 'phone', 'alternatePhone', 'email', 'website', 'address', 'bio']
  // Add more templates as needed
};

const Templates: React.FC<TemplateProps> = ({ selectedTemplate, fields, croppedImage }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageKey, setImageKey] = useState(0);

  useEffect(() => {
    setImageKey(prevKey => prevKey + 1);
  }, [croppedImage]);

  const renderProfileImage = (size: number) => {
    const imageUrl = croppedImage || (fields.profileImage as string) || null;

    if (imageUrl) {
      return (
        <>
          {imageLoading && <div className={`w-${size} h-${size} bg-gray-200 animate-pulse rounded-full`}></div>}
          <Image 
            key={imageKey}
            src={imageUrl}
            alt="Profile" 
            width={size} 
            height={size} 
            className={`object-cover w-full h-full rounded-full ${imageLoading ? 'hidden' : ''}`}
            onLoad={() => setImageLoading(false)}
            priority
          />
        </>
      );
    }
    return null;
  };

  const renderTemplate = (id: TemplateId) => {
    console.log('Rendering template:', id); // Add this log
    switch (id) {
      case 1:
        return (
          <div className="bg-white rounded-[2rem] shadow-lg overflow-hidden w-[400px] min-h-[240px] relative p-6">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold text-gray-800">{fields.name || 'Your Name'}</h2>
                <p className="text-sm text-gray-600 mt-1">{fields.jobTitle || 'Your Job Title'}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">{fields.bio || 'Your professional bio'}</p>
                <div className="mt-4 space-y-1">
                  {fields.phone && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {fields.phone}
                    </p>
                  )}
                  {fields.website && <p className="text-sm text-gray-600 ml-6">{fields.website}</p>}
                  {fields.email && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {fields.email}
                    </p>
                  )}
                  {fields.address && <p className="text-sm text-gray-600 ml-6">{fields.address}</p>}
                </div>
              </div>
              <div className="w-24 h-24 bg-blue-100 rounded-full overflow-hidden flex-shrink-0 ml-4">
                {renderProfileImage(96)}
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-100 rounded-full -z-10 transform translate-x-1/4 translate-y-1/4"></div>
          </div>
        );
      case 2:
        return (
          <div className="bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl shadow-lg overflow-hidden w-[400px] min-h-[240px] p-6">
            <div className="flex items-center mb-4">
              <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
              <p className="text-xs text-gray-600 uppercase">ORDIVART</p>
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 className="text-4xl font-bold text-gray-800">{fields.name || 'Your Name'}</h2>
                <p className="text-sm text-gray-600 mt-2">{fields.jobTitle || 'Your Job Title'}</p>
                <p className="text-sm text-gray-600 mt-4 line-clamp-2">{fields.bio || 'Your professional bio'}</p>
                <div className="mt-4 space-y-1">
                  {fields.phone && <p className="text-sm text-gray-600">{fields.phone}</p>}
                  {fields.alternatePhone && <p className="text-sm text-gray-600">{fields.alternatePhone}</p>}
                  {fields.website && <p className="text-sm text-gray-600">{fields.website}</p>}
                </div>
              </div>
              <div className="text-right">
                {fields.email && <p className="text-sm text-gray-600">{fields.email}</p>}
                <div className="w-32 h-32 bg-blue-300 rounded-full overflow-hidden mt-4">
                  {renderProfileImage(128)}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-[#f5e6d3] rounded-3xl shadow-lg overflow-hidden w-[400px] min-h-[240px] relative p-6">
            <h2 className="text-2xl font-bold text-gray-800">{fields.name || "Your Name"}</h2>
            <p className="text-sm text-gray-600 mt-1">{fields.jobTitle || 'Your Job Title'}</p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{fields.bio || 'Your professional bio'}</p>
            <div className="mt-4 space-y-1">
              <p className="text-sm text-gray-600 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Contact Details
              </p>
              {fields.email && <p className="text-sm text-gray-600 ml-6">{fields.email}</p>}
              {fields.phone && <p className="text-sm text-gray-600 ml-6">{fields.phone}</p>}
            </div>
            <div className="mt-4 space-y-1">
              {fields.address && <p className="text-sm text-gray-600">{fields.address}</p>}
              {fields.city && <p className="text-sm text-gray-600">{fields.city}</p>}
              {fields.postalCode && <p className="text-sm text-gray-600">{fields.postalCode}</p>}
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#e6d7c3] rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#e6d7c3] rounded-full transform translate-x-1/3 translate-y-1/3"></div>
          </div>
        );
      case 4:
        return (
          <div className="bg-[#e0f2f1] rounded-2xl shadow-lg overflow-hidden w-[400px] min-h-[240px] p-6">
            <h2 className="text-3xl font-bold text-gray-800">MODERN</h2>
            <p className="text-sm text-gray-600 mt-1">Elegant</p>
            <div className="mt-8">
              <p className="text-sm font-semibold text-gray-800">{`${fields.firstName || 'First'} ${fields.lastName || 'Last'}`}</p>
              <div className="flex justify-between mt-1">
                <div>
                  <p className="text-xs text-gray-600">Contact information</p>
                  <p className="text-xs text-gray-600">{fields.jobTitle || 'Your Job Title'}</p>
                </div>
                <div className="text-right">
                  {fields.website && <p className="text-xs text-gray-600">{fields.website}</p>}
                  {fields.workHours && <p className="text-xs text-gray-600">{fields.workHours}</p>}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 line-clamp-2">{fields.bio || 'Your professional bio'}</p>
            <div className="mt-8 flex space-x-2">
              {fields.phone && <div className="w-6 h-6 bg-gray-800 rounded-sm"></div>}
              {fields.email && <div className="w-6 h-6 bg-gray-800 rounded-sm"></div>}
              {fields.website && <div className="w-6 h-6 bg-gray-800 rounded-sm"></div>}
              {fields.address && <div className="w-6 h-6 bg-gray-800 rounded-sm"></div>}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[400px] min-h-[240px]">
            <div className="grid grid-cols-2 h-full">
              <div className="col-span-2 bg-[#fff9f5] p-4">
                <h2 className="text-5xl font-bold text-gray-800 leading-none">{fields.firstName || 'FIRST'}</h2>
                <h2 className="text-5xl font-bold text-gray-800 mt-1">{fields.lastName || 'LAST'}</h2>
              </div>
              <div className="p-4 flex flex-col justify-between">
                <div>
                  {fields.phone && <p className="text-sm text-gray-600">{fields.phone}</p>}
                  {fields.jobTitle && <p className="text-sm text-gray-600 mt-2">{fields.jobTitle}</p>}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contact information</p>
                  {fields.email && <p className="text-sm text-gray-600 mt-1">{fields.email}</p>}
                  {fields.website && <p className="text-sm text-gray-600">{fields.website}</p>}
                </div>
              </div>
              <div className="p-4 flex flex-col items-end justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                {fields.address && <p className="text-sm text-gray-600 text-right">{fields.address}</p>}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderTemplate(selectedTemplate)}
    </div>
  );
};

export default Templates;
