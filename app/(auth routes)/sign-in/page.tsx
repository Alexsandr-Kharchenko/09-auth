'use client';

import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { isAxiosError, type AxiosError } from 'axios';
import { login } from '@/lib/api/clientApi';
import { useAuthStore, type AuthState } from '@/lib/store/authStore';
import type { AuthCredentials } from '@/types/auth';
import css from './SignUpPage.module.css';

const isValidEmail = (value: string) => /.+@.+\..+/.test(value);

const SignInPage = () => {
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state: AuthState) => state.setUser);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = ((formData.get('email') ?? '') as string).trim();
    const password = (formData.get('password') as string) ?? '';

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    const payload: AuthCredentials = { email, password };

    try {
      setIsSubmitting(true);
      const user = await login(payload);
      setUser(user);

      await new Promise(resolve => setTimeout(resolve, 300));

      const redirectTarget = searchParams?.get('redirect');
      const destination =
        redirectTarget && redirectTarget.startsWith('/')
          ? redirectTarget
          : '/profile';

      window.location.href = destination;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          message?: string;
          error?: string;
          validation?: { body?: { message?: string } };
        }>;
        const responseData = axiosError.response?.data;

        if (axiosError.response?.status === 400) {
          const validationMessage = responseData?.validation?.body?.message;
          setError(
            validationMessage ??
              'Please check your email and password and try again.'
          );
          return;
        }

        if (axiosError.response?.status === 401) {
          setError(
            'Account not found or password is incorrect. Please sign up or check your credentials.'
          );
          return;
        }

        const message =
          responseData?.message ||
          responseData?.error ||
          axiosError.message ||
          'Login failed. Please try again.';
        setError(message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit} noValidate>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        {error && <p className={css.error}>{error}</p>}

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default SignInPage;
