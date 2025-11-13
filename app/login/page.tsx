'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/core/auth/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { signIn } = useAuth();
  const { t } = useTranslation('common');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email);
      alert(t('login.checkEmailLink'));
    } catch (error) {
      console.error('Login error:', error);
      alert(t('login.signInError'));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl mb-4">{t('login.title')}</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('login.email')}
          className="border p-2 w-full mb-4"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          {t('login.sendMagicLink')}
        </button>
      </form>
    </div>
  );
}