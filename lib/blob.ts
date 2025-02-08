import { put, del, list, PutBlobResult } from '@vercel/blob';
import { createSSEStream } from '@/lib/utils';

export type BlobResult<T = string> = {
  data: T;
  error?: string;
  success: boolean;
};

const handleBlobError = (e: unknown): string => 
  e instanceof Error ? e.message : 'Operation failed';

const createBlobResponse = <T>(data: T, error?: string): BlobResult<T> => ({
  data,
  error,
  success: !error
});

export async function uploadBlob(
  file: File | Buffer | string,
  options?: { pathname?: string; access?: 'public' }
): Promise<BlobResult<string>> {
  try {
    const pathname = options?.pathname || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const { url } = await put(pathname, file, { access: options?.access || 'public' });
    return createBlobResponse(url);
  } catch (e) {
    return createBlobResponse('', handleBlobError(e));
  }
}

export async function deleteBlob(url: string): Promise<BlobResult<boolean>> {
  try {
    await del(url);
    return createBlobResponse(true);
  } catch (e) {
    return createBlobResponse(false, handleBlobError(e));
  }
}

export async function listBlobs(prefix = ''): Promise<BlobResult<{ url: string; uploadedAt: Date }[]>> {
  try {
    const { blobs } = await list({ prefix });
    const files = blobs.map(({ url, uploadedAt }) => ({ url, uploadedAt }));
    return createBlobResponse(files);
  } catch (e) {
    return createBlobResponse([], handleBlobError(e));
  }
}

// Stream blob uploads for real-time progress
export async function streamBlobUpload(file: File): Promise<Response> {
  return createSSEStream(async (controller) => {
    try {
      const result = await uploadBlob(file);
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(result)}\n\n`));
    } catch (e) {
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: handleBlobError(e) })}\n\n`));
    } finally {
      controller.close();
    }
  });
} 