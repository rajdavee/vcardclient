import React, { useState } from 'react';

interface Field {
  name: string;
  type: string;
  placeholder: string;
}

interface AuthFormProps {
  fields: Field[];
  submitText: string;
  onSubmit: (formData: Record<string, string>) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ fields, submitText, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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