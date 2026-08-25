import * as React from 'react';
import {LoadingScreen} from './LoadingScreen';
import {authStore} from '../stores/authStore';
import {start} from '../actions/authActions';

export function AuthProvider({children}: {children: React.ReactNode}) {
  const auth = authStore();
  const [authError, setAuthError] = React.useState<Error | null>(null);
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    setAuthError(null);
    start().catch(e => {
      console.error('Error starting auth', e);
      setAuthError(e instanceof Error ? e : new Error(String(e)));
    })
    // Re-running start() on retry re-requests the exact same scope array
    // authActions.ts already defines -- retrying never broadens what's
    // requested, it just gives the user another chance to grant it (e.g.
    // after a scope was added and their existing consent no longer covers
    // it, or after a transient network/RPC failure).
  }, [attempt]);

  if (authError != null) {
    return (
      <div style={{padding: 32}}>
        <p>Authorization failed: {authError.message}</p>
        <button onClick={() => setAttempt((a) => a + 1)}>Retry</button>
      </div>
    );
  }

  if (auth.user == null) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
