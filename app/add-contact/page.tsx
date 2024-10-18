import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

import LoadingSpinner from '../components/LoadingSpinner';
const AddContactContent = dynamic(() => import('./AddContactContent'), { ssr: false });

const AddContactPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AddContactContent />
    </Suspense>
  );
};

export default AddContactPage;