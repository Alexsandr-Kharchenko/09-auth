import type { AxiosRequestConfig, AxiosError } from 'axios';
import { nextServer } from './api';
import type { Note, CreateNoteRequest } from '@/types/note';
import type { AuthCredentials, UpdateUserRequest } from '@/types/auth';
import type { User } from '@/types/user';

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const buildNotesParams = ({
  page = 1,
  perPage = 12,
  search,
  tag,
}: FetchNotesParams = {}) => ({
  page,
  perPage,
  ...(search && search.trim() !== '' ? { search } : {}),
  ...(tag && tag !== 'All' ? { tag } : {}),
});

export const fetchNotesRequest = async (
  params?: FetchNotesParams,
  config?: AxiosRequestConfig
) => {
  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params: buildNotesParams(params),
    ...config,
  });

  return response.data;
};

export const fetchNotes = async (params?: FetchNotesParams) =>
  fetchNotesRequest(params);

export const fetchNoteByIdRequest = async (
  id: string,
  config?: AxiosRequestConfig
) => {
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    ...config,
  });

  return response.data;
};

export const fetchNoteById = async (id: string) => fetchNoteByIdRequest(id);

export const createNoteRequest = async (
  payload: CreateNoteRequest,
  config?: AxiosRequestConfig
) => {
  const response = await nextServer.post<Note>('/notes', payload, {
    ...config,
  });

  return response.data;
};

export const createNote = async (payload: CreateNoteRequest) =>
  createNoteRequest(payload);

export const updateNoteRequest = async (
  id: string,
  payload: CreateNoteRequest,
  config?: AxiosRequestConfig
) => {
  const response = await nextServer.patch<Note>(`/notes/${id}`, payload, {
    ...config,
  });

  return response.data;
};

export const updateNote = async (id: string, payload: CreateNoteRequest) =>
  updateNoteRequest(id, payload);

export const deleteNoteRequest = async (
  id: string,
  config?: AxiosRequestConfig
) => {
  const response = await nextServer.delete<Note>(`/notes/${id}`, {
    ...config,
  });

  return response.data;
};

export const deleteNote = async (id: string) => deleteNoteRequest(id);

export const login = async (credentials: AuthCredentials) => {
  try {
    const response = await nextServer.post<User>('/auth/login', credentials);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || 'Login failed. Please try again.';
    throw new Error(message);
  }
};

export const register = async (credentials: AuthCredentials) => {
  try {
    const response = await nextServer.post<User>('/auth/register', credentials);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || 'Registration failed. Please try again.';
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    await nextServer.post('/auth/logout');
  } catch (err) {
    const error = err as AxiosError;
    console.error('Logout failed:', error.message);
  }
};

export const getSession = async () => {
  try {
    const response = await nextServer.get<User | null>('/auth/session');
    return response.data || null;
  } catch {
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await nextServer.get<User>('/users/me');
    return response.data;
  } catch {
    return null;
  }
};

export const updateUser = async (payload: UpdateUserRequest) => {
  try {
    const response = await nextServer.patch<User>('/users/me', payload);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    const message = error.response?.data?.message || 'Updating profile failed.';
    throw new Error(message);
  }
};
