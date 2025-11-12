'use client';

import { useState } from 'react';
import { useAuth } from '@/core/auth/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email);
      alert('Check your email for the login link!');
    } catch (error) {
      alert('Error signing in');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl mb-4">Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border p-2 w-full mb-4"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Send Magic Link
        </button>
      </form>
    </div>
  );
}