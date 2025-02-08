'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createCommunity } from '@/lib/actions';

const communitySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
});

type FormData = z.infer<typeof communitySchema>;

export function CreateCommunity() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(communitySchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const result = await createCommunity(data);
      if (result.success) {
        toast.success('Community created successfully!');
        reset();
      }
    } catch (error) {
      toast.error('Failed to create community');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Community</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Community Name"
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Textarea
              placeholder="Community Bio"
              {...register('bio')}
              className={errors.bio ? 'border-red-500' : ''}
            />
            {errors.bio && (
              <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Community'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 