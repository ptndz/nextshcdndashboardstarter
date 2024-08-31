import { Media } from '@/types';
import { Delete, Post } from './request';

export const uploadFiles = async (files: File[]): Promise<Media[]> => {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  return await Post<Media[]>('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file);

  return await Post<Media[]>('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteFiles = async (ids: number[]) => {
  return await Delete('/files', ids);
};
