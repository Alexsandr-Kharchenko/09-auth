'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { updateUser } from '@/lib/api/clientApi';
import { useAuthStore, type AuthState } from '@/lib/store/authStore';
import type { UpdateUserRequest } from '@/types/auth';
import type { User } from '@/types/user';
import css from './page.module.css';

type Props = { user: User };
type UpdateUserError = { message?: string; error?: string };

const EditProfileForm = ({ user }: Props) => {
  const router = useRouter();
  const setUser = useAuthStore((state: AuthState) => state.setUser);

  const [formData, setFormData] = useState<UpdateUserRequest>({
    username: user.username,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formData.username || formData.username.trim().length < 3) {
      setError('Username must be at least 3 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedUser = await updateUser({
        username: formData.username.trim(),
      });
      setUser(updatedUser);
      router.push('/profile');
    } catch (err: unknown) {
      if (isAxiosError<UpdateUserError>(err)) {
        const message =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Failed to update profile.';
        setError(message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update profile.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={css.profileInfo}>
      <p>
        <strong>Email:</strong> {user.email}
      </p>

      <div className={css.usernameWrapper}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          className={css.input}
          value={formData.username}
          onChange={handleChange}
          minLength={3}
          maxLength={50}
          required
          disabled={isSubmitting}
        />
      </div>

      {error && <p className={css.error}>{error}</p>}

      <div className={css.actions}>
        <button
          type="submit"
          className={css.saveButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </button>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;
