'use client'

import React, { useState, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { FaEnvelope, FaPhone, FaBuilding } from 'react-icons/fa';

type VCardInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
};

const templates = [
  { id: 1, name: 'Elegant', bgColor: 'bg-gradient-to-r from-purple-200 to-pink-200', textColor: 'text-gray-800' },
  { id: 2, name: 'Modern', bgColor: 'bg-gradient-to-r from-cyan-200 to-blue-200', textColor: 'text-gray-800' },
  { id: 3, name: 'Bold', bgColor: 'bg-gradient-to-r from-yellow-200 to-red-200', textColor: 'text-gray-800' },
  { id: 4, name: 'Minimalist', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  { id: 5, name: 'Nature', bgColor: 'bg-gradient-to-r from-green-200 to-lime-200', textColor: 'text-gray-800' },
];

export default function GenerateVCardPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<VCardInputs>();
  const previewRef = useRef<HTMLDivElement>(null);

  const watchedFields = watch();

  const onSubmit: SubmitHandler<VCardInputs> = async (data) => {
    await generateVCard(data);
    reset();
  };

  const generateVCard = async (data: VCardInputs) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.firstName} ${data.lastName}
N:${data.lastName};${data.firstName};;;
EMAIL:${data.email}
TEL:${data.phone}
ORG:${data.company}
END:VCARD`;

    const vcardBlob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    saveAs(vcardBlob, `${data.firstName}_${data.lastName}.vcf`);

    if (previewRef.current) {
      // Add a small delay
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Increase resolution
        useCORS: true,
        logging: true, // Enable logging for debugging
      });
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${data.firstName}_${data.lastName}_vcard.png`);
        }
      }, 'image/png', 1.0); // Specify full quality
    }
  };

  const renderPreview = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    return (
      <div 
        ref={previewRef}
        className={`w-full h-64 ${template?.bgColor} ${template?.textColor} rounded-lg shadow-md p-6 flex flex-col justify-between`}
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <div>
          <h2 className="text-3xl font-bold mb-2">{watchedFields.firstName} {watchedFields.lastName}</h2>
          <p className="text-lg font-semibold mb-4">{watchedFields.company}</p>
        </div>
        <div>
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>{watchedFields.email}</span>
          </div>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>{watchedFields.phone}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Create Your vCard</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Choose a Design</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className={`${template.bgColor} p-4 rounded-lg cursor-pointer transition-all ${selectedTemplate === template.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <p className={`text-center font-semibold ${template.textColor}`}>{template.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">First Name</label>
            <input
              {...register('firstName', { required: 'First name is required' })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Last Name</label>
            <input
              {...register('lastName', { required: 'Last name is required' })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone</label>
            <input
              {...register('phone', { required: 'Phone is required' })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Company</label>
            <input
              {...register('company')}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Generate vCard
          </button>
        </form>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Preview</h2>
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}