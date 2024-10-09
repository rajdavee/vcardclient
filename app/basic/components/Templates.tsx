import React from 'react';
import Image from 'next/image';

interface TemplateProps {
  selectedTemplate: number;
  onSelectTemplate: (id: number) => void;
  fields: Record<string, any>;
}
export type TemplateId = 1 | 2 | 3 | 4 | 5;

export const templateFields = {
  1: ['name', 'jobTitle', 'phone', 'email', 'website', 'address'],
  2: ['name', 'jobTitle', 'phone', 'email', 'website', 'address', 'city', 'postalCode'],
  3: ['name', 'jobTitle', 'phone', 'email', 'website', 'address', 'workHours'],
  4: ['firstName', 'lastName', 'jobTitle', 'phone', 'email', 'website', 'address'],
  5: ['firstName', 'lastName', 'jobTitle', 'phone', 'alternatePhone', 'email', 'website', 'address']
};

const Templates: React.FC<TemplateProps> = ({ selectedTemplate, onSelectTemplate, fields }) => {
  console.log('Selected Template:', selectedTemplate); // Add this line

  const getImageSrc = (profileImage: any) => {
    if (typeof profileImage === 'string' && profileImage.length > 0) {
      return profileImage.startsWith('http') 
        ? profileImage 
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}${profileImage}`;
    } else if (profileImage instanceof FileList && profileImage.length > 0) {
      return URL.createObjectURL(profileImage[0]);
    }
    return '/images/default-profile-image.png'; // Update this path
  };

  const renderTemplate = (id: number) => {
    console.log('Rendering template:', id); // Add this line
    switch (id) {
      case 1:
        return (
          <div className="bg-white rounded-[2rem] shadow-lg overflow-hidden w-[400px] h-[240px] relative">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{fields.name || 'PARE ZONL'}</h2>
                  <p className="text-sm text-gray-600 mt-1">{fields.jobTitle || 'JOB TITLE'}</p>
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {fields.phone || '987 45 rrm'}
                    </p>
                    <p className="text-sm text-gray-600 ml-6">{fields.website || 'timdeluve.oom'}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {fields.email || '082 9799 907 8 653'}
                    </p>
                    <p className="text-sm text-gray-600 ml-6">{fields.address || '@1325895.oom'}</p>
                  </div>
                </div>
                <div className="w-24 h-24 bg-blue-100 rounded-full overflow-hidden">
                  {fields.profileImage ? (
                    <Image 
                      src={getImageSrc(fields.profileImage)}
                      alt="Profile" 
                      width={96} 
                      height={96} 
                      className="object-cover w-full h-full" 
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-200"></div>
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
                  <h2 className="text-4xl font-bold text-gray-800">{fields.name || 'BAME WAMINY'}</h2>
                  <p className="text-sm text-gray-600 mt-2">{fields.jobTitle || 'TITLE TALE'}</p>
                  <p className="text-sm text-gray-600">CONTACH</p>
                  <p className="text-sm text-gray-600 mt-4">{fields.phone || '7 896019684689'}</p>
                  <p className="text-sm text-gray-600">{fields.alternatePhone || '1197 9898 5989'}</p>
                  <p className="text-sm text-gray-600 mt-4">{fields.website || 'www.Mobes.com'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{fields.email || 'ONISMino1/om'}</p>
                  <div className="w-32 h-32 bg-blue-300 rounded-full overflow-hidden mt-4">
                    {fields.profileImage ? (
                      <Image 
                        src={getImageSrc(fields.profileImage)}
                        alt="Profile" 
                        width={128} 
                        height={128} 
                        className="object-cover w-full h-full" 
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-200"></div>
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
              <h2 className="text-2xl font-bold text-gray-800">{fields.name || "User's Name"}</h2>
              <p className="text-sm text-gray-600 mt-1">{fields.jobTitle || 'Job'}</p>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  Contact Details
                </p>
                <p className="text-sm text-gray-600 ml-6">{fields.email || '@namendane.com'}</p>
                <p className="text-sm text-gray-600 ml-6">{fields.phone || '9075559977'}</p>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-gray-600">{fields.address || '22+935+28+2J0J'}</p>
                <p className="text-sm text-gray-600">{fields.city || '227 29+2J0J'}</p>
                <p className="text-sm text-gray-600">{fields.postalCode || '06 7865'}</p>
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
                <p className="text-sm font-semibold text-gray-800">{fields.name || 'Moleled Temm'}</p>
                <div className="flex justify-between mt-1">
                  <div>
                    <p className="text-xs text-gray-600">Conttact informetion</p>
                    <p className="text-xs text-gray-600">{fields.jobTitle || 'Webrcose Fort'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">{fields.website || 'www.jaleonerest.con'}</p>
                    <p className="text-xs text-gray-600">{fields.workHours || '12h1 8am-00am'}</p>
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
                <h2 className="text-5xl font-bold text-gray-800 leading-none">{fields.firstName || 'JOHN'}</h2>
                <h2 className="text-5xl font-bold text-gray-800 mt-1">{fields.lastName || 'DOE'}</h2>
              </div>
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <p className="text-sm text-gray-600">{fields.phone || 'Joh 12 458-7880'}</p>
                  <p className="text-sm text-gray-600 mt-2">{fields.jobTitle || 'Software Engineer'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contact infomation</p>
                  <p className="text-sm text-gray-600 mt-1">{fields.email || '123J @lueebe.com'}</p>
                  <p className="text-sm text-gray-600">{fields.website || 'Exanple.com'}</p>
                </div>
              </div>
              <div className="p-4 flex flex-col items-end justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <p className="text-sm text-gray-600 text-right">{fields.address || 'Website Anytown, USA'}</p>
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