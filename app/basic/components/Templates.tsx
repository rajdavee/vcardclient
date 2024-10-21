import React, { useState } from 'react';
import Image from 'next/image';
import { getImageSrc } from '../../utils/imageUtils';

export type TemplateId = 1 | 2 | 3 | 4 | 5;

interface TemplateProps {
  selectedTemplate: TemplateId;
  fields: Record<string, string | FileList>;
}

export const templateFields: Record<TemplateId, string[]> = {
  1: ['name', 'jobTitle', 'phone', 'email', 'website', 'address'],
  2: ['name', 'jobTitle', 'phone', 'email', 'website', 'address', 'city', 'postalCode'],
  3: ['name', 'jobTitle', 'phone', 'email', 'website', 'address', 'workHours'],
  
  4: ['firstName', 'lastName', 'jobTitle', 'phone', 'email', 'website', 'address'],
  5: ['firstName', 'lastName', 'jobTitle', 'phone', 'alternatePhone', 'email', 'website', 'address']
};

const Templates: React.FC<TemplateProps> = ({ selectedTemplate, fields }) => {
  console.log('Selected Template:', selectedTemplate);

  const [imageLoading, setImageLoading] = useState(true);

  const renderTemplate = (id: TemplateId) => {
    console.log('Rendering template:', id);
    switch (id) {
      case 1:
        return (
          <div className="bg-white rounded-[2rem] shadow-lg overflow-hidden w-[400px] h-[240px] relative">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{fields.name as string || 'PARE ZONL'}</h2>
                  <p className="text-sm text-gray-600 mt-1">{fields.jobTitle as string || 'JOB TITLE'}</p>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {fields.phone as string || '987 45 rrm'}
                    </p>
                    <p className="text-sm text-gray-600 ml-6">{fields.website as string || 'timdeluve.oom'}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {fields.email as string || '082 9799 907 8 653'}
                    </p>
                    <p className="text-sm text-gray-600 ml-6">{fields.address as string || '@1325895.oom'}</p>
                  </div>
                </div>
                <div className="w-24 h-24 bg-blue-100 rounded-full overflow-hidden">
                  {fields.profileImage && (
                    <>
                      {imageLoading && <div className="w-full h-full bg-gray-200 animate-pulse"></div>}
                      <Image 
                        src={getImageSrc(fields.profileImage)}
                        alt="Profile" 
                        width={96} 
                        height={96} 
                        className={`object-cover w-full h-full ${imageLoading ? 'hidden' : ''}`}
                        onLoad={() => setImageLoading(false)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-100 rounded-full -z-10 transform translate-x-1/4 translate-y-1/4"></div>
          </div>
        );
      case 2:
        return (
          <div className="bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl shadow-lg overflow-hidden w-[400px] h-[240px]">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                <p className="text-xs text-gray-600 uppercase">ORDIVART</p>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-bold text-gray-800">{fields.name as string || 'BAME WAMINY'}</h2>
                  <p className="text-sm text-gray-600 mt-2">{fields.jobTitle as string || 'TITLE TALE'}</p>
                  <p className="text-sm text-gray-600">CONTACH</p>
                  <p className="text-sm text-gray-600 mt-4">{fields.phone as string || '7 896019684689'}</p>
                  <p className="text-sm text-gray-600">{fields.alternatePhone as string || '1197 9898 5989'}</p>
                  <p className="text-sm text-gray-600 mt-4">{fields.website as string || 'www.Mobes.com'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{fields.email as string || 'ONISMino1/om'}</p>
                  <div className="w-32 h-32 bg-blue-300 rounded-full overflow-hidden mt-4">
                    {fields.profileImage && (
                      <>
                        {imageLoading && <div className="w-full h-full bg-gray-200 animate-pulse"></div>}
                        <Image 
                          src={getImageSrc(fields.profileImage)}
                          alt="Profile" 
                          width={128} 
                          height={128} 
                          className={`object-cover w-full h-full ${imageLoading ? 'hidden' : ''}`}
                          onLoad={() => setImageLoading(false)}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="bg-[#f5e6d3] rounded-3xl shadow-lg overflow-hidden w-[400px] h-[240px] relative">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800">{fields.name as string || "User's Name"}</h2>
              <p className="text-sm text-gray-600 mt-1">{fields.jobTitle as string || 'Job'}</p>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Contact Details
                </p>
                <p className="text-sm text-gray-600 ml-6">{fields.email as string || '@namendane.com'}</p>
                <p className="text-sm text-gray-600 ml-6">{fields.phone as string || '9075559977'}</p>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-gray-600">{fields.address as string || '22+935+28+2J0J'}</p>
                <p className="text-sm text-gray-600">{fields.city as string || '227 29+2J0J'}</p>
                <p className="text-sm text-gray-600">{fields.postalCode as string || '06 7865'}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#e6d7c3] rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#e6d7c3] rounded-full transform translate-x-1/3 translate-y-1/3"></div>
          </div>
        );
      case 4:
        return (
          <div className="bg-[#e0f2f1] rounded-2xl shadow-lg overflow-hidden w-[400px] h-[240px]">
            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-800">MODERN</h2>
              <p className="text-sm text-gray-600 mt-1">Elegant</p>
              <div className="mt-8">
                <p className="text-sm font-semibold text-gray-800">{fields.name as string || 'Moleled Temm'}</p>
                <div className="flex justify-between mt-1">
                  <div>
                    <p className="text-xs text-gray-600">Conttact informetion</p>
                    <p className="text-xs text-gray-600">{fields.jobTitle as string || 'Webrcose Fort'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{fields.website as string || 'www.jaleonerest.con'}</p>
                    <p className="text-xs text-gray-600">{fields.workHours as string || '12h1 8am-00am'}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex space-x-2">
                <div className="w-6 h-6 bg-gray-800 rounded-sm"></div>
                <div className="w-6 h-6 bg-gray-800 rounded-sm"></div>
                <div className="w-6 h-6 bg-gray-800 rounded-sm"></div>
                <div className="w-6 h-6 bg-gray-800 rounded-sm"></div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-[400px] h-[240px]">
            <div className="grid grid-cols-2 h-full">
              <div className="col-span-2 bg-[#fff9f5] p-4">
                <h2 className="text-5xl font-bold text-gray-800 leading-none">{fields.firstName as string || 'JOHN'}</h2>
                <h2 className="text-5xl font-bold text-gray-800 mt-1">{fields.lastName as string || 'DOE'}</h2>
              </div>
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-600">{fields.phone as string || 'Joh 12 458-7880'}</p>
                  <p className="text-sm text-gray-600 mt-2">{fields.jobTitle as string || 'Software Engineer'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contact infomation</p>
                  <p className="text-sm text-gray-600 mt-1">{fields.email as string || '123J @lueebe.com'}</p>
                  <p className="text-sm text-gray-600">{fields.website as string || 'Exanple.com'}</p>
                </div>
              </div>
              <div className="p-4 flex flex-col items-end justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <p className="text-sm text-gray-600 text-right">{fields.address as string || 'Website Anytown, USA'}</p>
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
