import { put, del, list, PutBlobResult } from '@vercel/blob';
import { createSSEStream } from '@/lib/utils';

export type BlobAccess = 'public' | 'private';

export type BlobResult<T = string> = {
  data: T;
  error?: string;
  success: boolean;
};

export type BlobUploadOptions = {
  pathname?: string;
  access?: BlobAccess;
  contentType?: string;
  maxSize?: number; // in bytes
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB default limit

const handleBlobError = (e: unknown): string => {
  if (e instanceof Error) {
    return e.message;
  }
  if (typeof e === 'string') {
    return e;
  }
  return 'Operation failed';
};

const createBlobResponse = <T>(data: T, error?: string): BlobResult<T> => ({
  data,
  error,
  success: !error
});

const validateFile = (file: File | Buffer | string, maxSize = MAX_FILE_SIZE): string | null => {
  if (file instanceof File && file.size > maxSize) {
    return `File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`;
  }
  if (Buffer.isBuffer(file) && file.length > maxSize) {
    return `File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`;
  }
  return null;
};

export async function uploadBlob(
  file: File | Buffer | string,
  options?: BlobUploadOptions
): Promise<BlobResult<string>> {
  try {
    const validationError = validateFile(file, options?.maxSize);
    if (validationError) {
      return createBlobResponse('', validationError);
    }

    const pathname = options?.pathname || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const { url } = await put(pathname, file, {
      access: (options?.access || 'public') as 'public',
      contentType: options?.contentType,
      addRandomSuffix: !options?.pathname,
    });
    
    return createBlobResponse(url);
  } catch (e) {
    console.error('Blob upload error:', e);
    return createBlobResponse('', handleBlobError(e));
  }
}

export async function deleteBlob(url: string): Promise<BlobResult<boolean>> {
  try {
    if (!url.startsWith('https://')) {
      return createBlobResponse(false, 'Invalid blob URL');
    }
    await del(url);
    return createBlobResponse(true);
  } catch (e) {
    console.error('Blob deletion error:', e);
    return createBlobResponse(false, handleBlobError(e));
  }
}

export async function listBlobs(prefix = '', limit?: number): Promise<BlobResult<{ url: string; uploadedAt: Date; pathname: string }[]>> {
  try {
    const { blobs } = await list({ prefix, limit });
    const files = blobs.map(({ url, uploadedAt, pathname }) => ({ 
      url, 
      uploadedAt,
      pathname 
    }));
    return createBlobResponse(files);
  } catch (e) {
    console.error('Blob listing error:', e);
    return createBlobResponse([], handleBlobError(e));
  }
}

// Stream blob uploads for real-time progress
export async function streamBlobUpload(
  file: File, 
  options?: BlobUploadOptions
): Promise<Response> {
  return createSSEStream(async (controller) => {
    try {
      const validationError = validateFile(file, options?.maxSize);
      if (validationError) {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: validationError })}\n\n`));
        return;
      }

      // Send initial progress
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ progress: 0 })}\n\n`));
      
      const result = await uploadBlob(file, options);
      
      // Send completion
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ ...result, progress: 100 })}\n\n`));
    } catch (e) {
      console.error('Stream upload error:', e);
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: handleBlobError(e) })}\n\n`));
    } finally {
      controller.close();
    }
  });
} 