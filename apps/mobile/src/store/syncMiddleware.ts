import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setOnline } from './networkSlice';
import { syncPendingRequirements } from './requirementsSlice';
import { flushPendingAlerts } from '../location/geofenceTask';

export const syncListener = createListenerMiddleware();

// When connectivity flips offline → online, flush both queues.
syncListener.startListening({
  actionCreator: setOnline,
  effect: async (action, api) => {
    const wasOnline = (api.getOriginalState() as any).network.isOnline;
    if (action.payload && !wasOnline) {
      await api.dispatch(syncPendingRequirements() as any);
      await flushPendingAlerts();
    }
  },
});
