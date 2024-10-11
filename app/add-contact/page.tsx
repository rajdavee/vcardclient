import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const AddContactContent = dynamic(() => import('./AddContactContent'), { ssr: false });

const AddContactPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddContactContent />
    </Suspense>
  );
};

export default AddContactPage;