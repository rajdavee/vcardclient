import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import QRCode from 'react-qr-code';
import { Phone, Mail, Globe, MapPin } from 'react-feather';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // You can specify the weights you want to use
});

export type TemplateId = number; // Instead of 1 | 2 | 3 | 4 | 5

interface TemplateProps {
  selectedTemplate: TemplateId;
  fields: Record<string, any>;
  croppedImage: string | null;
  vCardId?: string;
}

export const templateFields: Record<TemplateId, string[]> = {
  1: ['name', 'jobTitle', 'companyName', 'phone', 'email', 'website', 'address',  'linkedin', 'twitter'],
  2: ['name', 'firstName', 'lastName', 'jobTitle', 'companyName', 'phone', 'mobile', 'email', 'website', 'address', 'city', 'state', 'postalCode', 'country', 'linkedin', 'twitter'],
  3: ['name', 'jobTitle', 'companyName', 'phone', 'email', 'website',  'linkedin'],
  4: ['name', 'jobTitle', 'companyName', 'phone', 'email', 'website',  'linkedin', 'twitter'],
  5: ['name', 'jobTitle', 'companyName', 'phone', 'email', 'website', 'address', 'linkedin', 'twitter'],
  6: ['name', 'jobTitle', 'companyName', 'phone', 'mobile', 'email', 'website', 'address',  'linkedin', 'twitter'],
  7: ['name', 'jobTitle', 'companyName', 'phone', 'email', 'website', 'linkedin', 'twitter'],
  8: ['name', 'jobTitle', 'companyName', 'phone', 'mobile', 'email', 'website', 'linkedin', 'twitter'],
  9: ['name', 'firstName', 'lastName', 'jobTitle', 'companyName', 'phone', 'mobile', 'email', 'website', 'linkedin', 'twitter'],
  10: ['name', 'firstName', 'lastName', 'jobTitle', 'companyName', 'phone', 'mobile', 'email', 'website', 'address', 'linkedin', 'twitter'],
  11: ['name', 'jobTitle', 'companyName', 'phone', 'email', 'website', 'address', 'linkedin', 'twitter'], 
  12: ['name', 'jobTitle', 'companyName', 'phone', 'mobile', 'email', 'website', 'address', 'linkedin', 'twitter'],
  13: ['name', 'jobTitle', 'companyName', 'phone', 'email', 'website', 'address',  'linkedin', 'twitter'],
  14: ['name', 'jobTitle', 'companyName', 'phone', 'mobile', 'email', 'website', 'address',  'linkedin', 'twitter'],
  15: ['raj', 'firstName', 'lastName', 'jobTitle', 'companyName', 'phone', 'email', 'website', 'address',  'linkedin', 'twitter'], 
};


interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormInputs {
  name: string;
  email: string;
  message: string;
}

const Templates: React.FC<TemplateProps> = ({ selectedTemplate, fields, croppedImage, vCardId: propVCardId }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageKey, setImageKey] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pathname = usePathname();

  // Extract vCardId from URL if not provided as prop
  const getVCardId = () => {
    if (propVCardId) return propVCardId;
    
    // First try to get from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const vCardIdFromParams = urlParams.get('vCardId');
    if (vCardIdFromParams) return vCardIdFromParams;

    // Then try to get from path
    const pathParts = pathname.split('/');
    const vCardIdFromPath = pathParts.find(part => 
      part && part.length > 8 && /^[a-zA-Z0-9]+$/.test(part)
    );
    
    console.log('Getting vCardId:', {
      propVCardId,
      vCardIdFromParams,
      vCardIdFromPath,
      pathname
    });

    return vCardIdFromPath || null;
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInputs>();

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

  const onSubmit = async (data: FormInputs) => {
    const vCardId = getVCardId();
    console.log('Submitting form with vCardId:', vCardId); // Debug log

    if (!vCardId) {
      console.error('VCard ID not found:', {
        propVCardId,
        pathname,
        search: window.location.search
      });
      toast.error('Unable to submit form: VCard ID not found');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'submitForm',
          vCardId,
          name: data.name,
          email: data.email,
          message: data.message
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit form');
      }

      toast.success('Message sent successfully!');
      reset();
      setShowContactForm(false);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ContactForm = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
        <button 
          onClick={() => setShowContactForm(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h3 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              {...register("message", { required: "Message is required" })}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your message..."
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 active:transform active:scale-[0.98]'
              }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </div>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      </div>
    </div>
  );

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
case 6:
        return (
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl shadow-lg overflow-hidden w-[400px] min-h-[240px] relative p-6">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h2 className="text-3xl font-bold text-gray-800">{fields.name || 'Your Name'}</h2>
                <p className="text-sm text-gray-600 mt-1">{fields.jobTitle || 'Your Job Title'}</p>
                <p className="text-sm text-gray-600 mt-4 line-clamp-3">{fields.bio || 'Your professional bio'}</p>
                
                <div className="mt-4 space-y-2">
                  {fields.phone && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {fields.phone}
                    </p>
                  )}
                  {fields.email && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {fields.email}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="w-28 h-28 bg-white rounded-full overflow-hidden flex-shrink-0 ml-4 shadow-lg">
                {renderProfileImage(112)}
              </div>
            </div>
            
            <button
              onClick={() => setShowContactForm(true)}
              className="absolute bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow-lg transition-colors duration-200"
            >
              Contact Me
            </button>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -z-10 transform translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-200 rounded-full -z-10 transform -translate-x-1/3 translate-y-1/3 opacity-50"></div>
          </div>
        );
 case 7:
        return (
          <div className="bg-[#363636] text-white rounded-xl shadow-lg overflow-hidden w-[635px] h-[388px] p-8 flex relative">
            {/* QR Code Section */}
            <div className="flex-shrink-0 flex items-center justify-center mr-6">
              <QRCode 
                value={JSON.stringify(fields)}
                size={256}
                level="H"
                className="bg-white p-2 rounded-lg"
              />
            </div>

            {/* Centered Vertical Line */}
            <div className="h-[277px] w-[1.5px] bg-gradient-to-b from-[#555555] to-[#D9D9D9] "></div>

            {/* Contact Information */}
            <div className="flex flex-col justify-center space-y-4 ml-6 pl-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-wide">{fields.name || 'Your Name'}</h1>
                <p className="text-gray-300">{fields.jobTitle || 'Your Job Title'}</p>
              </div>

              <div className="space-y-3 mt-4">
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-300" />
                  <span>{fields.phone || 'Your Phone'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-300" />
                  <span>{fields.email || 'Your Email'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-gray-300" />
                  <span>{fields.website || 'Your Website'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-300" />
                  <span>{fields.address || 'Your Address'}</span>
                </div>
              </div>
            </div>
          </div>
        );
case 8:
        return (
          <div className="group w-[635px] h-[388px]" style={{ perspective: '1000px' }}>
            <div 
              className="relative w-full h-full duration-1000 ease-in-out transition-transform group-hover:[transform:rotateY(180deg)]" 
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of the card (Company Name only) */}
              <div className="absolute w-full h-full bg-[#1E1E1E] rounded-xl p-6"
                   style={{ backfaceVisibility: 'hidden' }}>
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Red lines on either side of the company name */}
                  <div className="absolute w-full h-[2px] top-1/2 -translate-y-1/2 flex justify-between items-center">
                    <div className="w-[40%] h-full bg-red-500"></div>
                    <div className="w-[40%] h-full bg-red-500"></div>
                  </div>
                  {/* Company name centered between the lines */}
                  <div className="text-white text-6xl font-bold z-10 px-4 bg-[#1E1E1E]">
                    {fields.companyName || 'company name'}
                  </div>
                </div>
              </div>

              {/* Back of the card (Contact Information) */}
              <div className="absolute w-full h-full bg-[#1E1E1E] rounded-xl p-8"
                   style={{ 
                     backfaceVisibility: 'hidden',
                     transform: 'rotateY(180deg)'
                   }}>
                <div className="relative w-full h-full">
                  <div className="w-[calc(100%-160px)] pr-4">
                    {/* Profile Section with conditional rendering */}
                    <div className="flex items-start gap-4">
                      {croppedImage ? (
                        // Show uploaded profile image if available
                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image 
                            src={croppedImage}
                            alt="Profile"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        // Show fallback initial circle if no image
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-3xl lowercase">
                            {(fields.name && fields.name.length > 0) ? fields.name.charAt(0) : 'r'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h2 className="text-white text-3xl font-medium">{fields.name || 'name'}</h2>
                        <p className="text-gray-400 text-xl mt-1">{fields.jobTitle || 'job title'}</p>
                      </div>
                    </div>

                    {/* Company Name with Line */}
                    <div className="mt-12">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl text-white">{fields.companyName || 'company name'}</span>
                        <div className="h-[2px] flex-grow bg-red-500"></div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-6 mt-12">
                      <div className="flex items-center text-gray-300 text-xl">
                        <Phone size={24} className="mr-4" />
                        <span>{fields.phone || 'phone'}</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-xl">
                        <Globe size={24} className="mr-4" />
                        <a 
                          href={fields.website || 'website'} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="truncate hover:text-white transition-colors duration-200"
                        >
                          {fields.website || 'website'}
                        </a>
                      </div>
                      <div className="flex items-center text-gray-300 text-xl">
                        <MapPin size={24} className="mr-4" />
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fields.address || 'address')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-white transition-colors duration-200"
                        >
                          {fields.address || 'address'}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* QR Code - Fixed position at bottom right */}
                  <div className="absolute bottom-0 right-0 w-32 h-32">
                    <QRCode 
                      value={JSON.stringify(fields)}
                      size={128}
                      level="H"
                      className="w-full h-full bg-white p-2 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
case 9:

return (  
    <div className={`${montserrat.className} group w-[635px] h-[300px]`} style={{ perspective: '1000px' }}>
      <div 
        className="relative w-full h-full duration-1000 ease-in-out transition-transform group-hover:[transform:rotateY(180deg)]" 
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of the card (Logo and Company Name) */}
        <div className="absolute w-full h-full bg-white rounded-xl flex items-center justify-center" 
             style={{ backfaceVisibility: 'hidden' }}>
          <div className="text-center relative w-full h-full">
            {/* Vertical Line */}
            <div className="absolute top-0 bottom-0 left-[5%] h-[300px] w-[3px] bg-[#353535]"></div>
            {/* Logo and Company Name */}
            <div className="flex flex-col items-center justify-center h-full">
              {/* Logo */}
              <div className="mb-4">
                <img 
                  src={fields.logo || '/images/logo-placeholder.png'} 
                  alt="Company Logo" 
                  className="mx-auto h-16"
                />
              </div>
              {/* Company Name */}
              <h1 className="text-2xl font-bold" style={{ color: '#313131' }}>
                {fields.companyName || 'Company Name'}
              </h1>
            </div>
          </div>
        </div>

        {/* Back of the card (Contact Information) */}
        <div className="absolute w-full h-full bg-white rounded-xl p-8 flex flex-col justify-between" 
             style={{ 
               backfaceVisibility: 'hidden',
               transform: 'rotateY(180deg)'
             }}>
          {/* Name and Title */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              {/* Profile Image or Placeholder */}
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                <Image
                  src="/images/profile.png" // Path relative to the 'public' directory
                  alt="Profile Image"
                  className="w-full h-full rounded-full object-cover"
                  width={48} // You can adjust the width and height based on your needs
                  height={48}
                />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#313131' }}>
                  {fields.name || 'Name'}
                </h2>
                <p className="text-sm" style={{ color: '#313131' }}>
                  {fields.jobTitle || 'Job Title'}
                </p>
              </div>
            </div>

            {/* Horizontal Line */}
            <div className="w-full h-[2px] bg-[#353535] mb-4"></div>

            {/* Contact Details and QR Code in One Container */}
            <div className="flex justify-between items-start mt-8">
              {/* Contact Details */}
              <div className="space-y-3">
                {/* Phone */}
                <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                  <img src="/images/phone.png" alt="Phone Icon" className="mr-2 w-4 h-4" />
                  <span>{fields.phone || 'Phone Number'}</span>
                </div>
                {/* Email */}
                <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                  <img src="/images/email.png" alt="Email Icon" className="mr-2 w-4 h-4" />
                  <span>{fields.email || 'Email Address'}</span>
                </div>
                {/* Website */}
                <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                  <img src="/images/website.png" alt="Website Icon" className="mr-2 w-4 h-4" />
                  <a 
                    href={fields.website || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-800 transition"
                  >
                    {fields.website || 'Website URL'}
                  </a>
                </div>
                {/* Location */}
                <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                  <img src="/images/location.png" alt="Location Icon" className="mr-2 w-4 h-4" />
                  <span>{fields.address || 'Address'}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="w-20 h-20 mt-[7%]">
                <QRCode 
                  value={JSON.stringify(fields)} 
                  size={80} 
                  level="H" 
                  className="w-full h-full bg-white p-1 rounded-md" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
case 10:
  return (
    <div className={`${montserrat.className} group w-[635px] h-[300px]`} style={{ perspective: '1000px' }}>
      <div 
        className="relative w-full h-full duration-1000 ease-in-out transition-transform group-hover:[transform:rotateY(180deg)]" 
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of the card (Logo and Company Name) */}
        <div className="absolute w-full h-full bg-black rounded-xl flex items-center justify-center" 
             style={{ backfaceVisibility: 'hidden' }}>
          <div className="text-center relative w-full h-full">
            {/* Vertical Line */}
            <div className="absolute top-0 bottom-0 left-[5%] h-[300px] w-[3px] bg-red-600"></div>
            {/* Logo and Company Name */}
            <div className="flex flex-col items-center justify-center h-full">
              {/* Logo */}
              <div className="mb-4">
                <img 
                  src={fields.logo || '/images/logo-placeholder.png'} 
                  alt="Company Logo" 
                  className="mx-auto h-16"
                />
              </div>
              {/* Company Name */}
              <h1 className="text-2xl font-bold text-white">
                {fields.companyName || 'Company Name'}
              </h1>
            </div>
          </div>
        </div>

        {/* Back of the card (Contact Information) */}
        <div className="absolute w-full h-full bg-white rounded-xl p-8 flex flex-col justify-between" 
             style={{ 
               backfaceVisibility: 'hidden',
               transform: 'rotateY(180deg)'
             }}>
          {/* Name and Title */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              {/* Profile Image or Placeholder */}
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                <Image
                  src="/images/profile.png" // Path relative to the 'public' directory
                  alt="Profile Image"
                  className="w-full h-full rounded-full object-cover"
                  width={48} // You can adjust the width and height based on your needs
                  height={48}
                />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#313131' }}>
                  {fields.name || 'Name'}
                </h2>
                <p className="text-sm" style={{ color: '#313131' }}>
                  {fields.jobTitle || 'Job Title'}
                </p>
              </div>
            </div>

            {/* Horizontal Line - changed color to red */}
            <div className="w-full h-[2px] bg-red-600 mb-4"></div>

            {/* Contact Details and QR Code in One Container */}
            <div className="flex justify-between items-start mt-8">
              {/* Contact Details */}
              <div className="space-y-3">
                {/* Phone */}
                <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                  <img src="/images/phone.png" alt="Phone Icon" className="mr-2 w-4 h-4" />
                  <span>{fields.phone || 'Phone Number'}</span>
                </div>
                {/* Email */}
                <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                  <img src="/images/email.png" alt="Email Icon" className="mr-2 w-4 h-4" />
                  <span>{fields.email || 'Email Address'}</span>
                </div>
                {/* Website */}
                <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                  <img src="/images/website.png" alt="Website Icon" className="mr-2 w-4 h-4" />
                  <a 
                    href={fields.website || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-800 transition"
                  >
                    {fields.website || 'Website URL'}
                  </a>
                </div>
                {/* Location */}
                <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                  <img src="/images/location.png" alt="Location Icon" className="mr-2 w-4 h-4" />
                  <span>{fields.address || 'Address'}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="w-20 h-20 mt-[7%]">
                <QRCode 
                  value={JSON.stringify(fields)} 
                  size={80} 
                  level="H" 
                  className="w-full h-full bg-white p-1 rounded-md" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
case 11:
    return (
      <div className={`${montserrat.className} group w-[635px] h-[300px]`} style={{ perspective: '1000px' }}>
        <div 
          className="relative w-full h-full duration-1000 ease-in-out transition-transform group-hover:[transform:rotateY(180deg)]" 
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front of the card (Logo and Company Name) */}
          <div className="absolute w-full h-full bg-[#ED9E3E] rounded-xl flex items-center justify-center" 
               style={{ backfaceVisibility: 'hidden' }}>
            <div className="text-center relative w-full h-full">
              {/* Vertical Line */}
              <div className="absolute top-0 bottom-0 left-[5%] h-[300px] w-[3px] bg-white"></div>
              {/* Logo and Company Name */}
              <div className="flex flex-col items-center justify-center h-full">
                {/* Logo */}
                <div className="mb-4">
                  <img 
                    src={fields.logo || '/images/logo-placeholder.png'} 
                    alt="Company Logo" 
                    className="mx-auto h-16"
                  />
                </div>
                {/* Company Name */}
                <h1 className="text-2xl font-bold text-white">
                  {fields.companyName || 'Company Name'}
                </h1>
              </div>
            </div>
          </div>
  
          {/* Back of the card (Contact Information) */}
          <div className="absolute w-full h-full bg-[#EBECE7] rounded-xl p-8 flex flex-col justify-between" 
               style={{ 
                 backfaceVisibility: 'hidden',
                 transform: 'rotateY(180deg)'
               }}>
            {/* Name and Title */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                {/* Profile Image or Placeholder */}
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <Image
                    src="/images/profile.png" // Path relative to the 'public' directory
                    alt="Profile Image"
                    className="w-full h-full rounded-full object-cover"
                    width={48} // You can adjust the width and height based on your needs
                    height={48}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: '#313131' }}>
                    {fields.name || 'Name'}
                  </h2>
                  <p className="text-sm" style={{ color: '#313131' }}>
                    {fields.jobTitle || 'Job Title'}
                  </p>
                </div>
              </div>
  
              {/* Horizontal Line - changed color to #ED9E3E */}
              <div className="w-full h-[2px] bg-[#ED9E3E] mb-4"></div>
  
              {/* Contact Details and QR Code in One Container */}
              <div className="flex justify-between items-start mt-8">
                {/* Contact Details */}
                <div className="space-y-3">
                  {/* Phone */}
                  <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                    <img src="/images/phone.png" alt="Phone Icon" className="mr-2 w-4 h-4" />
                    <span>{fields.phone || 'Phone Number'}</span>
                  </div>
                  {/* Email */}
                  <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                    <img src="/images/email.png" alt="Email Icon" className="mr-2 w-4 h-4" />
                    <span>{fields.email || 'Email Address'}</span>
                  </div>
                  {/* Website */}
                  <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                    <img src="/images/website2.png" alt="Website Icon" className="mr-2 w-4 h-4" />
                    <a 
                      href={fields.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-800 transition"
                    >
                      {fields.website || 'Website URL'}
                    </a>
                  </div>
                  {/* Location */}
                  <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                    <img src="/images/location.png" alt="Location Icon" className="mr-2 w-4 h-4" />
                    <span>{fields.address || 'Address'}</span>
                  </div>
                </div>
  
                {/* QR Code */}
                <div className="w-20 h-20 mt-[7%]">
                  <QRCode 
                    value={JSON.stringify(fields)} 
                    size={80} 
                    level="H" 
                    className="w-full h-full bg-white p-1 rounded-md" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );    
case 12:
      return (
        <div className={`${montserrat.className} group w-[635px] h-[300px]`} style={{ perspective: '1000px' }}>
          <div 
            className="relative w-full h-full duration-1000 ease-in-out transition-transform group-hover:[transform:rotateY(180deg)]" 
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front of the card (Logo and Company Name) */}
            <div className="absolute w-full h-full bg-[#A7B5D8] rounded-xl flex items-center justify-center" 
                 style={{ backfaceVisibility: 'hidden' }}>
              <div className="text-center relative w-full h-full">
                {/* Vertical Line */}
                <div className="absolute top-0 bottom-0 left-[5%] h-[300px] w-[3px] bg-black"></div>
                {/* Logo and Company Name */}
                <div className="flex flex-col items-center justify-center h-full">
                  {/* Logo */}
                  <div className="mb-4">
                    <img 
                      src={fields.logo || '/images/logo-placeholder.png'} 
                      alt="Company Logo" 
                      className="mx-auto h-16"
                    />
                  </div>
                  {/* Company Name */}
                  <h1 className="text-2xl font-bold text-white">
                    {fields.companyName || 'Company Name'}
                  </h1>
                </div>
              </div>
            </div>
    
            {/* Back of the card (Contact Information) */}
            <div className="absolute w-full h-full bg-white rounded-xl p-8 flex flex-col justify-between" 
                 style={{ 
                   backfaceVisibility: 'hidden',
                   transform: 'rotateY(180deg)'
                 }}>
              {/* Name and Title */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {/* Profile Image or Placeholder */}
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <Image
                      src="/images/profile2.png" // Path relative to the 'public' directory
                      alt="Profile Image"
                      className="w-full h-full rounded-full object-cover"
                      width={48} // You can adjust the width and height based on your needs
                      height={48}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: '#313131' }}>
                      {fields.name || 'Name'}
                    </h2>
                    <p className="text-sm" style={{ color: '#313131' }}>
                      {fields.jobTitle || 'Job Title'}
                    </p>
                  </div>
                </div>
    
                {/* Horizontal Line - changed color to black */}
                <div className="w-full h-[2px] bg-black mb-4"></div>
    
                {/* Contact Details and QR Code in One Container */}
                <div className="flex justify-between items-start mt-8">
                  {/* Contact Details */}
                  <div className="space-y-3">
                    {/* Phone */}
                    <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                      <img src="/images/phone.png" alt="Phone Icon" className="mr-2 w-4 h-4" />
                      <span>{fields.phone || 'Phone Number'}</span>
                    </div>
                    {/* Email */}
                    <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                      <img src="/images/email.png" alt="Email Icon" className="mr-2 w-4 h-4" />
                      <span>{fields.email || 'Email Address'}</span>
                    </div>
                    {/* Website */}
                    <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                      <img src="/images/website.png" alt="Website Icon" className="mr-2 w-4 h-4" />
                      <a 
                        href={fields.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-800 transition"
                      >
                        {fields.website || 'Website URL'}
                      </a>
                    </div>
                    {/* Location */}
                    <div className="flex items-center text-sm" style={{ color: '#313131' }}>
                      <img src="/images/location.png" alt="Location Icon" className="mr-2 w-4 h-4" />
                      <span>{fields.address || 'Address'}</span>
                    </div>
                  </div>
    
                  {/* QR Code */}
                  <div className="w-20 h-20 mt-[7%]">
                    <QRCode 
                      value={JSON.stringify(fields)} 
                      size={80} 
                      level="H" 
                      className="w-full h-full bg-white p-1 rounded-md" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
case 13:
        return (
          <div className={`${montserrat.className} w-[635px] h-[388px] flex items-center justify-center bg-white`}>
            <div className="relative w-full h-full flex">
              {/* Left Half - White Background */}
              <div className="w-1/2 h-full bg-white flex items-center justify-center">
                {/* Logo */}
                <div className="text-center">
                  <img 
                    src={fields.logo || '/images/logo-placeholder.png'} 
                    alt="Company Logo" 
                    className="mx-auto h-16"
                  />
                </div>
              </div>
      
              {/* Right Half - Dark Gray Background */}
              <div className="w-1/2 h-full bg-[#2A2A2A] flex flex-col justify-between p-4">
                {/* Top Left - Name and Designation */}
                <div className="text-left text-white mb-4">
                  <h1 className="text-xl font-bold">
                    {fields.name || 'Name'}
                  </h1>
                  <p className="text-sm">
                    {fields.jobTitle || 'Job Title'}
                  </p>
                </div>
      
                {/* Bottom Left - Contact Information with Icons */}
                <div className="text-left text-white space-y-3">
                  {/* Phone */}
                  <div className="flex items-center text-sm">
                    <img src="/images/phone2.png" alt="Phone Icon" className="mr-2 w-4 h-4" />
                    <span>{fields.phone || 'Phone Number'}</span>
                  </div>
                  {/* Email */}
                  <div className="flex items-center text-sm">
                    <img src="/images/email2.png" alt="Email Icon" className="mr-2 w-4 h-4" />
                    <span>{fields.email || 'Email Address'}</span>
                  </div>
                  {/* Website */}
                  <div className="flex items-center text-sm">
                    <img src="/images/website3.png" alt="Website Icon" className="mr-2 w-4 h-4" />
                    <a 
                      href={fields.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-300 transition"
                    >
                      {fields.website || 'Website URL'}
                    </a>
                  </div>
                  {/* Location */}
                  <div className="flex items-center text-sm">
                    <img src="/images/location2.png" alt="Location Icon" className="mr-2 w-4 h-4" />
                    <span>{fields.address || 'Address'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
case 14:
          return (
            <div className={`${montserrat.className} w-[635px] h-[388px] flex items-center justify-center bg-white`}>
              <div className="relative w-full h-full flex">
                {/* Left Half - Dark Gray Background */}
                <div className="w-1/2 h-full bg-[#272829] flex items-center justify-center">
                  {/* Logo */}
                  <div className="text-center">
                    <img 
                      src={fields.logo || '/images/logo-placeholder.png'} 
                      alt="Company Logo" 
                      className="mx-auto h-16"
                    />
                  </div>
                </div>
        
                {/* Right Half - Golden Yellow Background */}
                <div className="w-1/2 h-full bg-[#F4CE14] flex flex-col justify-between p-4">
                  {/* Top Left - Name and Designation */}
                  <div className="text-left text-[#272829] mb-4">
                    <h1 className="text-xl font-bold">
                      {fields.name || 'Name'}
                    </h1>
                    <p className="text-sm">
                      {fields.jobTitle || 'Job Title'}
                    </p>
                  </div>
        
                  {/* Bottom Left - Contact Information with Icons */}
                  <div className="text-left text-[#272829] space-y-3">
                    {/* Phone */}
                    <div className="flex items-center text-sm">
                      <img src="/images/phone2.png" alt="Phone Icon" className="mr-2 w-4 h-4" />
                      <span>{fields.phone || 'Phone Number'}</span>
                    </div>
                    {/* Email */}
                    <div className="flex items-center text-sm">
                      <img src="/images/email2.png" alt="Email Icon" className="mr-2 w-4 h-4" />
                      <span>{fields.email || 'Email Address'}</span>
                    </div>
                    {/* Website */}
                    <div className="flex items-center text-sm">
                      <img src="/images/website3.png" alt="Website Icon" className="mr-2 w-4 h-4" />
                      <a 
                        href={fields.website || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-300 transition"
                      >
                        {fields.website || 'Website URL'}
                      </a>
                    </div>
                    {/* Location */}
                    <div className="flex items-center text-sm">
                      <img src="/images/location2.png" alt="Location Icon" className="mr-2 w-4 h-4" />
                      <span>{fields.address || 'Address'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );    
case 15:
            return (
              <div className={`${montserrat.className} w-[600px] h-[550px] group`} style={{ perspective: '1000px' }}>
                <div
                  className="relative w-full h-full duration-1000 ease-in-out transition-transform group-hover:[transform:rotateY(180deg)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Front of the card - Dark Grayish Green Background */}
                  <div
                    className="absolute w-full h-full bg-[#595A5C] rounded-xl flex items-center justify-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="text-center">
                      <img
                        src={fields.logo || '/images/logo-placeholder.png'}
                        alt="Company Logo"
                        className="mx-auto h-16"
                      />
                    </div>
                  </div>
          
                  {/* Back of the card - Light Off-White Background */}
                  <div
                    className="absolute w-full h-full bg-[#FAFBFD] rounded-xl p-6 flex flex-col justify-end"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    {/* Centered Content at the Bottom */}
                    <div className="text-center text-[#1D1D1D] space-y-3">
                      {/* Name and Designation */}
                      <div>
                        <h1 className="text-xl font-bold">{fields.name || 'Name'}</h1>
                        <p className="text-sm">{fields.jobTitle || 'Job Title'}</p>
                      </div>
          
                      {/* Horizontal Black Line after Name and Designation */}
                      <div className="w-[20%] h-[2px] bg-black my-4 mx-auto"></div>
          
                      {/* Contact Information */}
                      <div className="space-y-3">
                        {/* Phone */}
                        <div className="flex justify-center items-center text-sm">
                          <img src="/images/phone2.png" alt="Phone Icon" className="mr-2 w-4 h-4" />
                          <span>{fields.phone || 'Phone Number'}</span>
                        </div>
                        {/* Email */}
                        <div className="flex justify-center items-center text-sm">
                          <img src="/images/email2.png" alt="Email Icon" className="mr-2 w-4 h-4" />
                          <span>{fields.email || 'Email Address'}</span>
                        </div>
                        {/* Website */}
                        <div className="flex justify-center items-center text-sm">
                          <img src="/images/website3.png" alt="Website Icon" className="mr-2 w-4 h-4" />
                          <a
                            href={fields.website || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-300 transition"
                          >
                            {fields.website || 'Website URL'}
                          </a>
                        </div>
                        {/* Location */}
                        <div className="flex justify-center items-center text-sm">
                          <img src="/images/location2.png" alt="Location Icon" className="mr-2 w-4 h-4" />
                          <span>{fields.address || 'Address'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>  
            );
       
        default:
        return null;
    }
  };

  const generateVCardString = (fields: Record<string, any>) => {
    // Debug log to check incoming fields
    console.log('Template fields:', fields);

    const encodeField = (value: string | undefined) => {
      if (!value) return '';
      return value
        .toString()
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n')
        .trim();
    };

    const cleanPhone = (phone: string | undefined) => {
      if (!phone) return '';
      return phone.replace(/[^+0-9]/g, '');
    };

    // Ensure all fields are properly accessed
    const firstName = fields.firstName || '';
    const lastName = fields.lastName || '';
    const fullName = fields.name || `${firstName} ${lastName}`.trim();
    const company = fields.companyName || fields.company || ''; // Try both field names

    const vCardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      // Name fields with proper encoding
      `FN:${encodeField(fullName)}`,
      `N:${encodeField(lastName)};${encodeField(firstName)};;;`,
      
      // Organization and title
      company ? `ORG:${encodeField(company)}` : '',
      fields.jobTitle ? `TITLE:${encodeField(fields.jobTitle)}` : '',
      
      // Phone numbers with proper formatting
      fields.phone ? `TEL;TYPE=WORK,VOICE:${cleanPhone(fields.phone)}` : '',
      fields.mobile ? `TEL;TYPE=CELL,VOICE:${cleanPhone(fields.mobile)}` : '',
      
      // Email and website - ensure website is included
      fields.email ? `EMAIL;TYPE=WORK,INTERNET:${encodeField(fields.email)}` : '',
      fields.website ? `URL:${encodeField(fields.website)}` : '',
      
      // Complete address with all components
      (fields.address || fields.city || fields.state || fields.country) ? 
        `ADR;TYPE=WORK:;;${[
          encodeField(fields.address),
          encodeField(fields.city),
          encodeField(fields.state),
          encodeField(fields.postalCode),
          encodeField(fields.country)
        ].join(';')}` : '',
      
      // Social profiles
      fields.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${encodeField(fields.linkedin)}` : '',
      fields.twitter ? `X-SOCIALPROFILE;TYPE=twitter:${encodeField(fields.twitter)}` : '',
      
      // Notes
      fields.note ? `NOTE:${encodeField(fields.note)}` : '',
      'END:VCARD'
    ].filter(line => line);

    const vCard = vCardLines.join('\r\n');
    
    // Debug log to check final vCard string
    console.log('Generated vCard string:', vCard);
    
    return vCard;
  };

  return (
    <div>
      {renderTemplate(selectedTemplate)}
      {showContactForm && <ContactForm />}
    </div>
  );
};

export default Templates;
