'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Card } from '../../../components/Card';
import { Spinner } from '../../../components/Spinner';

export default function IDUpload() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('idImage', data.idImage[0]);
      const res = await fetch('/api/auth/verify/id-upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('ID upload failed');
      window.location.href = '/auth/success';
    } catch (err) {
      setError(err.message);
      window.location.href = '/auth/error';
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Your Student ID</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          Upload a clear image of your student ID to verify your university affiliation.
        </p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="Student ID Image"
              type="file"
              accept="image/*"
              {...register('idImage', { required: 'Student ID image is required' })}
              error={errors.idImage?.message}
            />
          </div>
          <Button variant="primary" type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner className="w-5 h-5 mx-auto" /> : 'Upload ID'}
          </Button>
        </form>
      </Card>
    </div>
  );
}