'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface ExtendedNavigator extends Navigator {
  contacts?: {
    select: (props: string[], opts: { multiple: boolean }) => Promise<any[]>;
    save?: (contact: any) => Promise<void>;
  };
}

const AddContactContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Processing contact information...');

  useEffect(() => {
    const vCardData = searchParams.get('vCardData');
    if (vCardData) {
      handleVCardData(vCardData);
    } else {
      setMessage('No contact information found.');
    }
  }, [searchParams]);

  const handleVCardData = (vCardData: string) => {
    const extendedNavigator = navigator as ExtendedNavigator;
    if (extendedNavigator.contacts && 'save' in extendedNavigator.contacts) {
      // Use Contact API to save the contact directly
      handleContactSave(vCardData);
    } else {
      // Fallback to vCard download with improved UX
      provideVCardDownload(vCardData);
    }
  };

  const handleContactSave = async (vCardData: string) => {
    try {
      const extendedNavigator = navigator as ExtendedNavigator;
      if (extendedNavigator.contacts && extendedNavigator.contacts.save) {
        const contact = parseVCardToContactObject(vCardData);
        await extendedNavigator.contacts.save(contact);
        setMessage('Contact saved successfully!');
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      setMessage('Failed to save contact automatically. Please try the manual download option.');
      provideVCardDownload(vCardData);
    }
  };

  const parseVCardToContactObject = (vCardData: string) => {
    // This is a simple parser and might need to be expanded based on your vCard structure
    const lines = vCardData.split('\n');
    const contact: any = {};
    lines.forEach(line => {
      const [key, value] = line.split(':');
      if (key === 'FN') contact.name = [{ givenName: value }];
      if (key === 'TEL') contact.tel = [{ value: value }];
      if (key === 'EMAIL') contact.email = [{ value: value }];
    });
    return contact;
  };

  const provideVCardDownload = (vCardData: string) => {
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);

    // Create a hidden link and click it programmatically
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'contact.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setMessage('Contact file downloaded. Please open it with your contacts app to save.');

    // Provide instructions based on the device
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      setMessage('Contact file downloaded. Please open it with the Contacts app to save.');
    } else if (/Android/.test(navigator.userAgent)) {
      setMessage('Contact file downloaded. Please open it with your Contacts app to save.');
    } else {
      setMessage('Contact file downloaded. Please import it into your contacts application.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Contact</h1>
      <p>{message}</p>
    </div>
  );
};

export default AddContactContent;