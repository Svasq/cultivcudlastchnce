import { put, del, list, PutBlobResult, ListBlobResult } from '@vercel/blob';

type BlobContent = string | Buffer;

export type BlobResponse<T = string> = {
  data: T;
  error?: string;
};

export const uploadToBlob = async (
  pathname: string,
  content: BlobContent,
  options = { access: 'public' as const }
): Promise<BlobResponse> => {
  try {
    const { url } = await put(pathname, content, options);
    return { data: url };
  } catch (e) {
    return { data: '', error: e instanceof Error ? e.message : 'Upload failed' };
  }
};

export const deleteFromBlob = async (url: string): Promise<BlobResponse<boolean>> => {
  try {
    await del(url);
    return { data: true };
  } catch (e) {
    return { data: false, error: e instanceof Error ? e.message : 'Delete failed' };
  }
};

export const listBlobFiles = async (prefix = ''): Promise<BlobResponse<ListBlobResult>> => {
  try {
    const files = await list({ prefix });
    return { data: files };
  } catch (e) {
    return { 
      data: { blobs: [], hasMore: false, cursor: '' }, 
      error: e instanceof Error ? e.message : 'List failed' 
    };
  }
}; 