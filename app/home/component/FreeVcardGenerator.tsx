import React from 'react';
import Link from 'next/link';

export const FreeVcardGenerator: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-800 leading-tight">
              Free <span className="text-blue-600">vCard</span> Generator
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              Create your professional vCard in seconds and stand out from the crowd!
            </p>
            <Link href="/generate-vcard" passHref>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md">
                Create Your vCard Now
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-blue-600 py-4 px-8">
          <p className="text-center text-white text-sm">
            No Purchase Required  • 100% free • Instant download
          </p>
        </div>
      </div>
    </div>
  );
};

export default FreeVcardGenerator;  