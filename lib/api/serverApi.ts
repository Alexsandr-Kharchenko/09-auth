import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import { api } from './api';
import type { Note } from '@/types/note';
import type { UpdateUserRequest } from '@/types/auth';
import type { User } from '@/types/user';
import type { FetchNotesParams } from './clientApi';

const mergeConfigs = async (
  config?: AxiosRequestConfig
): Promise<AxiosRequestConfig> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  return {
    ...config,
    headers: {
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(config?.headers ?? {}),
    },
  };
};

export const fetchNotesServer = async (params?: FetchNotesParams) => {
  const config = await mergeConfigs();
  const res = await api.get('/notes', { params, ...config });
  return res.data;
};

export const fetchNoteByIdServer = async (id: string) => {
  const config = await mergeConfigs();
  const res = await api.get<Note>(`/notes/${id}`, config);
  return res.data;
};

export const createNoteServer = async (
  payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
) => {
  const config = await mergeConfigs();
  const res = await api.post<Note>('/notes', payload, config);
  return res.data;
};

export const updateNoteServer = async (id: string, payload: Partial<Note>) => {
  const config = await mergeConfigs();
  const res = await api.patch<Note>(`/notes/${id}`, payload, config);
  return res.data;
};

export const deleteNoteServer = async (id: string) => {
  const config = await mergeConfigs();
  const res = await api.delete<Note>(`/notes/${id}`, config);
  return res.data;
};

export const getSessionServer = async (): Promise<AxiosResponse> => {
  const config = await mergeConfigs();
  return await api.get('/auth/session', config);
};

export const checkSession = async (_refreshToken: string) => {
  try {
    const response = await getSessionServer();
    const { accessToken, refreshToken: newRefreshToken } = response.data ?? {};

    if (accessToken && newRefreshToken) {
      return { accessToken, refreshToken: newRefreshToken };
    }

    return null;
  } catch (error) {
    console.error('checkSession failed:', error);
    return null;
  }
};

export const getCurrentUserServer = async () => {
  try {
    const config = await mergeConfigs();
    const res = await api.get<User>('/users/me', config);
    return res.data;
  } catch {
    return null;
  }
};

export const updateUserServer = async (payload: UpdateUserRequest) => {
  const config = await mergeConfigs();
  const res = await api.patch<User>('/users/me', payload, config);
  return res.data;
};

// --- Експорти ---
export const fetchNotes = fetchNotesServer;
export const fetchNoteById = fetchNoteByIdServer;
