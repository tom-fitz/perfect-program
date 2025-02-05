'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { inviteUser } from '@/lib/actions/users';

export default function InviteClientButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    const result = await inviteUser({ email });

    if (result.success) {
      setStatus('success');
      setEmail('');
      setTimeout(() => {
        setIsOpen(false);
        setStatus('idle');
      }, 2000);
    } else {
      setStatus('error');
      setError(result.error);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90 transition-colors font-medium"
      >
        <Plus className="w-4 h-4 mr-2" />
        Invite Client
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-ebony p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-powder">
              Invite New Client
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-black/20 border border-gray-800 rounded-lg text-powder focus:outline-none focus:ring-2 focus:ring-sunglow"
                    required
                  />
                </div>

                {status === 'error' && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-400 hover:text-powder transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-4 py-2 bg-sunglow text-ebony rounded-lg hover:bg-sunglow/90 transition-colors font-medium disabled:opacity-50"
                  >
                    {status === 'loading'
                      ? 'Sending...'
                      : status === 'success'
                        ? 'Sent!'
                        : 'Send Invite'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
