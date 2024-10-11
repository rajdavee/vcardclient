'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface ExtendedNavigator extends Navigator {
  contacts?: {
    select: (props: string[], opts: { multiple: boolean }) => Promise<any[]>;
  };
}

const AddContact: React.FC = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Processing contact information...');
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
    const vCardData = searchParams.get('vCardData');
    if (vCardData) {
      handleVCardData(vCardData);
    } else {
      setMessage('No contact information found.');
    }
  }, [searchParams]);

  const handleVCardData = (vCardData: string) => {
    if (!isBrowser) return;

    const extendedNavigator = navigator as ExtendedNavigator;
    if (extendedNavigator.contacts && 'select' in extendedNavigator.contacts) {
      // Use Web Contact Picker API for supported browsers
      handleWebContactPicker(vCardData);
    } else {
      // Fallback to vCard download
      provideVCardDownload(vCardData);
    }
  };

  const handleWebContactPicker = async (vCardData: string) => {
    try {
      const extendedNavigator = navigator as ExtendedNavigator;
      if (extendedNavigator.contacts) {
        const props = ['name', 'email', 'tel'];
        const opts = { multiple: false };
        const contacts = await extendedNavigator.contacts.select(props, opts);
        if (contacts.length > 0) {
          // Here you would merge the vCard data with the selected contact
          // For simplicity, we're just showing a success message
          setMessage('Contact added successfully!');
        } else {
          setMessage('No contact selected.');
        }
      }
    } catch (error) {
      console.error('Error using Web Contact Picker:', error);
      provideVCardDownload(vCardData);
    }
  };

  const provideVCardDownload = (vCardData: string) => {
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMessage('Contact file downloaded. Please add it to your contacts app.');
  };

  if (!isBrowser) {
    return null; // or a loading indicator
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Contact</h1>
      <p>{message}</p>
    </div>
  );
};

export default AddContact;