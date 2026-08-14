/**
 * Server mutation helper.
 * All write operations (INSERT/UPDATE/RPC) go through /api/mutate
 * so the service role key stays server-side only.
 */

type MutateInsertArgs = {
  table: string;
  payload: Record<string, any>;
  select?: string;
};

type MutateUpdateArgs = {
  table: string;
  payload: Record<string, any>;
  match: Record<string, any>;
};

type MutateRpcArgs = {
  rpc: string;
  args?: Record<string, any>;
};

type MutateResult<T> = { data: T | null; error: string | null };

async function callMutate<T>(body: object): Promise<MutateResult<T>> {
  try {
    const res = await fetch('/api/mutate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok || json.error) {
      return { data: null, error: json.error || `HTTP ${res.status}` };
    }
    return { data: json.data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Network error' };
  }
}

export const serverMutate = {
  insert: <T = any>(args: MutateInsertArgs) =>
    callMutate<T>({ operation: 'insert', ...args }),

  update: (args: MutateUpdateArgs) =>
    callMutate<boolean>({ operation: 'update', ...args }),

  rpc: (args: MutateRpcArgs) =>
    callMutate<any>(args),
};
