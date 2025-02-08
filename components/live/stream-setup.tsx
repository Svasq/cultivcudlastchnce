'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { startStream } from '@/lib/actions';

const streamSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
});

type FormData = z.infer<typeof streamSchema>;

interface StreamSetupProps {
  communityId: number;
}

export function StreamSetup({ communityId }: StreamSetupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(streamSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await startStream({
        ...data,
        communityId,
      });
      
      if (result.success) {
        toast.success('Stream created successfully!');
        reset();
      }
    } catch (error) {
      toast.error('Failed to create stream');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Stream Title"
          {...register('title')}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Start Stream'}
      </Button>
    </form>
  );
} 