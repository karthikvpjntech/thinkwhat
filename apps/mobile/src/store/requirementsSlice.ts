import { createAsyncThunk, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { apiFetch } from '../services/api';
import type { RootState } from './index';

export type RequirementInput = { title: string; description?: string; category?: string; lat: number; lng: number };
export type Requirement = RequirementInput & {
  clientId: string;              // idempotency key, generated offline
  id?: string;                   // server id once synced
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  attempts: number;
  createdAt: number;
};

type State = { items: Requirement[]; syncing: boolean };
const initialState: State = { items: [], syncing: false };

/** Create: always saved locally first (optimistic). Synced immediately if online. */
export const createRequirement = createAsyncThunk('requirements/create',
  async (input: RequirementInput, { dispatch, getState }) => {
    const clientId = nanoid();
    dispatch(requirementsSlice.actions.queued({ ...input, clientId, status: 'pending', attempts: 0, createdAt: Date.now() }));
    if ((getState() as RootState).network.isOnline) await dispatch(syncPendingRequirements());
    return clientId;
  });

export const syncPendingRequirements = createAsyncThunk('requirements/sync',
  async (_, { getState, dispatch }) => {
    const pending = (getState() as RootState).requirements.items.filter((r) => r.status === 'pending' || r.status === 'failed');
    for (const r of pending) {
      dispatch(requirementsSlice.actions.markSyncing(r.clientId));
      try {
        const { clientId, status, attempts, id, createdAt, ...body } = r;
        const saved = await apiFetch<{ id: string }>('/requirements', {
          method: 'POST',
          headers: { 'Idempotency-Key': clientId }, // server should dedupe on this
          body: JSON.stringify({ ...body, clientId }),
        });
        dispatch(requirementsSlice.actions.synced({ clientId, id: saved.id }));
      } catch (e: any) {
        dispatch(requirementsSlice.actions.failed(r.clientId));
        if (!e?.status) break; // network error → stop, retry when back online
      }
    }
  },
  { condition: (_, { getState }) => !(getState() as RootState).requirements.syncing });

const requirementsSlice = createSlice({
  name: 'requirements',
  initialState,
  reducers: {
    queued: (s, a: PayloadAction<Requirement>) => { s.items.unshift(a.payload); },
    markSyncing: (s, a: PayloadAction<string>) => { const r = s.items.find((i) => i.clientId === a.payload); if (r) r.status = 'syncing'; },
    synced: (s, a: PayloadAction<{ clientId: string; id: string }>) => {
      const r = s.items.find((i) => i.clientId === a.payload.clientId); if (r) { r.status = 'synced'; r.id = a.payload.id; }
    },
    failed: (s, a: PayloadAction<string>) => {
      const r = s.items.find((i) => i.clientId === a.payload); if (r) { r.status = 'failed'; r.attempts += 1; }
    },
  },
  extraReducers: (b) => {
    b.addCase(syncPendingRequirements.pending, (s) => { s.syncing = true; })
     .addCase(syncPendingRequirements.fulfilled, (s) => { s.syncing = false; })
     .addCase(syncPendingRequirements.rejected, (s) => { s.syncing = false; });
  },
});

export const selectPendingCount = (s: RootState) => s.requirements.items.filter((r) => r.status !== 'synced').length;
export default requirementsSlice.reducer;
