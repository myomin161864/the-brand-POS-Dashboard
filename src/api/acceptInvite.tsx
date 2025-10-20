// /auth/accept-invite.tsx (React + TS)
import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';

export default function AcceptInvite() {
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hash = window.location.hash?.slice(1) ?? '';
    const params = new URLSearchParams(hash);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    

    (async () => {
      try {
        if (!access_token || !refresh_token) {
          setError('Missing tokens in invite redirect.');
          return;
        }
        // Create a session from invite tokens
        const { error: setErr } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (setErr) { setError(setErr.message); return; }
        setReady(true);
      } catch (e: any) {
        setError(e.message ?? 'Unexpected error');
      }
    })();
  }, []);

  if (error) return <div className="p-4 text-red-500">Invite error: {error}</div>;
  if (!ready) return <div className="p-4">Preparing your account…</div>;

  // Now render a "Set Password" form
  return <SetInitialPassword />;
}

function SetInitialPassword() {
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setErr(null);
    if (pwd.length < 8) return setErr('Password must be at least 8 characters');
    if (pwd !== confirm) return setErr('Passwords do not match');

    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) setErr(error.message);
    else setDone(true);
  };

  if (done) return <div className="p-4">Password set! Redirecting…</div>;

  return (
    <div className="space-y-3 p-4">
      <h2 className="text-lg font-semibold">Set your password</h2>
      <input type="password" placeholder="New password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
      <input type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      {err && <div className="text-red-500 text-sm">{err}</div>}
      <button onClick={submit} className="px-3 py-2 bg-indigo-600 text-white rounded">Save</button>
    </div>
  );
}