import React, { useState } from 'react';

interface Field {
  name: string;
  type: string;
  placeholder: string;
}

interface AuthFormProps {
  fields: Field[];
  submitText: string;
  onSubmit: (formData: Record<string, string>) => Promise<void>;
}

const AuthForm: React.FC<AuthFormProps> = ({ fields, submitText, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      // You might want to set an error state here and display it to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="sr-only">
            {field.placeholder}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder={field.placeholder}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      ))}
      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
